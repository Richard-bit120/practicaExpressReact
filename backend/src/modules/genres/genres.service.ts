import { Repository, Like } from "typeorm";
import { AppDataSource } from "../../config/data-source";
import { Genre } from "./genre.entity";
import { Book } from "../books/book.entity";
import { AppError } from "../../shared/errors/app-error";
import { logger } from "../../shared/logging/logger";

interface CreateGenreDto {
  name: string;
  description?: string | null;
}

interface UpdateGenreDto {
  name?: string;
  description?: string | null;
}

interface ListGenresParams {
  search?: string;
  page?: number;
  limit?: number;
}

export class GenresService {
  private get genreRepository(): Repository<Genre> {
    return AppDataSource.getRepository(Genre);
  }

  private get bookRepository(): Repository<Book> {
    return AppDataSource.getRepository(Book);
  }

  async findAll(params: ListGenresParams) {
    const { search, page = 1, limit = 10 } = params;
    const skip = (page - 1) * limit;

    const where = search ? [{ name: Like(`%${search}%`) }] : {};

    const [genres, total] = await this.genreRepository.findAndCount({
      where,
      order: { name: "ASC" },
      skip,
      take: limit,
    });

    return {
      data: genres,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findById(id: number): Promise<Genre> {
    const genre = await this.genreRepository.findOne({
      where: { id },
      relations: { books: true },
    });

    if (!genre) {
      throw new AppError(`Género con ID ${id} no encontrado`, 404);
    }

    return genre;
  }

  async create(dto: CreateGenreDto): Promise<Genre> {
    const existing = await this.genreRepository.findOne({
      where: { name: dto.name },
    });
    if (existing) {
      throw new AppError(
        `Ya existe un género con el nombre '${dto.name}'`,
        409,
      );
    }

    const genre = this.genreRepository.create({
      name: dto.name,
      description: dto.description ?? null,
    });

    const saved = await this.genreRepository.save(genre);
    logger.info(`Género creado: ID=${saved.id}, Nombre='${saved.name}'`);
    return saved;
  }

  async update(id: number, dto: UpdateGenreDto): Promise<Genre> {
    const genre = await this.genreRepository.findOne({ where: { id } });
    if (!genre) {
      throw new AppError(`Género con ID ${id} no encontrado`, 404);
    }

    if (dto.name && dto.name !== genre.name) {
      const existing = await this.genreRepository.findOne({
        where: { name: dto.name },
      });
      if (existing) {
        throw new AppError(
          `Ya existe un género con el nombre '${dto.name}'`,
          409,
        );
      }
      genre.name = dto.name;
    }

    if (dto.description !== undefined) {
      genre.description = dto.description;
    }

    const updated = await this.genreRepository.save(genre);
    logger.info(`Género actualizado: ID=${id}, Nombre='${updated.name}'`);
    return updated;
  }

  async delete(id: number): Promise<void> {
    const genre = await this.genreRepository.findOne({ where: { id } });
    if (!genre) {
      throw new AppError(`Género con ID ${id} no encontrado`, 404);
    }

    const bookCount = await this.bookRepository.count({
      where: { genreId: id },
    });
    if (bookCount > 0) {
      throw new AppError(
        `No se puede eliminar el género '${genre.name}' porque tiene ${bookCount} libro(s) asociado(s)`,
        409,
      );
    }

    await this.genreRepository.remove(genre);
    logger.info(`Género eliminado: ID=${id}, Nombre='${genre.name}'`);
  }
}
