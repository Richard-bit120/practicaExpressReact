import { Repository, Like } from 'typeorm';
import { AppDataSource } from '../../config/data-source';
import { Author } from './author.entity';
import { Book } from '../books/book.entity';
import { AppError } from '../../shared/errors/app-error';
import { logger } from '../../shared/logging/logger';

interface CreateAuthorDto {
  name: string;
  biography?: string | null;
}

interface UpdateAuthorDto {
  name?: string;
  biography?: string | null;
}

interface ListAuthorsParams {
  search?: string;
  page?: number;
  limit?: number;
}

export class AuthorsService {
  private authorRepository: Repository<Author>;
  private bookRepository: Repository<Book>;

  constructor() {
    this.authorRepository = AppDataSource.getRepository(Author);
    this.bookRepository = AppDataSource.getRepository(Book);
  }

  async findAll(params: ListAuthorsParams) {
    const { search, page = 1, limit = 10 } = params;
    const skip = (page - 1) * limit;

    const where = search
      ? [{ name: Like(`%${search}%`) }]
      : {};

    const [authors, total] = await this.authorRepository.findAndCount({
      where,
      order: { name: 'ASC' },
      skip,
      take: limit,
    });

    return {
      data: authors,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findById(id: number): Promise<Author> {
    const author = await this.authorRepository.findOne({
      where: { id },
      relations: ['books'],
    });

    if (!author) {
      throw new AppError(`Autor con ID ${id} no encontrado`, 404);
    }

    return author;
  }

  async create(dto: CreateAuthorDto): Promise<Author> {
    const existing = await this.authorRepository.findOne({
      where: { name: dto.name },
    });

    if (existing) {
      throw new AppError(`Ya existe un autor con el nombre '${dto.name}'`, 409);
    }

    const author = this.authorRepository.create({
      name: dto.name,
      biography: dto.biography ?? null,
    });

    const saved = await this.authorRepository.save(author);
    logger.info(`Autor creado: ID=${saved.id}, Nombre='${saved.name}'`);
    return saved;
  }

  async update(id: number, dto: UpdateAuthorDto): Promise<Author> {
    const author = await this.authorRepository.findOne({ where: { id } });

    if (!author) {
      throw new AppError(`Autor con ID ${id} no encontrado`, 404);
    }

    if (dto.name && dto.name !== author.name) {
      const existing = await this.authorRepository.findOne({
        where: { name: dto.name },
      });
      if (existing) {
        throw new AppError(`Ya existe un autor con el nombre '${dto.name}'`, 409);
      }
      author.name = dto.name;
    }

    if (dto.biography !== undefined) {
      author.biography = dto.biography;
    }

    const updated = await this.authorRepository.save(author);
    logger.info(`Autor actualizado: ID=${id}, Nombre='${updated.name}'`);
    return updated;
  }

  async delete(id: number): Promise<void> {
    const author = await this.authorRepository.findOne({ where: { id } });

    if (!author) {
      throw new AppError(`Autor con ID ${id} no encontrado`, 404);
    }

    const bookCount = await this.bookRepository.count({ where: { authorId: id } });

    if (bookCount > 0) {
      throw new AppError(
        `No se puede eliminar el autor '${author.name}' porque tiene ${bookCount} libro(s) asociado(s)`,
        409
      );
    }

    await this.authorRepository.remove(author);
    logger.info(`Autor eliminado: ID=${id}, Nombre='${author.name}'`);
  }
}