import { Repository, Like } from "typeorm";
import { AppDataSource } from "../../config/data-source";
import { Saga } from "./saga.entity";
import { Book } from "../books/book.entity";
import { AppError } from "../../shared/errors/app-error";
import { logger } from "../../shared/logging/logger";

interface CreateSagaDto {
  name: string;
  description?: string | null;
}

interface UpdateSagaDto {
  name?: string;
  description?: string | null;
}

interface ListSagasParams {
  search?: string;
  page?: number;
  limit?: number;
}

export class SagasService {
  private get sagaRepository(): Repository<Saga> {
    return AppDataSource.getRepository(Saga);
  }

  private get bookRepository(): Repository<Book> {
    return AppDataSource.getRepository(Book);
  }

  async findAll(params: ListSagasParams) {
    const { search, page = 1, limit = 10 } = params;
    const skip = (page - 1) * limit;

    const where = search ? [{ name: Like(`%${search}%`) }] : {};

    const [sagas, total] = await this.sagaRepository.findAndCount({
      where,
      order: { name: "ASC" },
      skip,
      take: limit,
    });

    return {
      data: sagas,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findById(id: number): Promise<Saga> {
    const saga = await this.sagaRepository.findOne({
      where: { id },
      relations: { books: true },
    });

    if (!saga) {
      throw new AppError(`Saga con ID ${id} no encontrada`, 404);
    }

    return saga;
  }

  async create(dto: CreateSagaDto): Promise<Saga> {
    const existing = await this.sagaRepository.findOne({
      where: { name: dto.name },
    });
    if (existing) {
      throw new AppError(`Ya existe una saga con el nombre '${dto.name}'`, 409);
    }

    const saga = this.sagaRepository.create({
      name: dto.name,
      description: dto.description ?? null,
    });

    const saved = await this.sagaRepository.save(saga);
    logger.info(`Saga creada: ID=${saved.id}, Nombre='${saved.name}'`);
    return saved;
  }

  async update(id: number, dto: UpdateSagaDto): Promise<Saga> {
    const saga = await this.sagaRepository.findOne({ where: { id } });
    if (!saga) {
      throw new AppError(`Saga con ID ${id} no encontrada`, 404);
    }

    if (dto.name && dto.name !== saga.name) {
      const existing = await this.sagaRepository.findOne({
        where: { name: dto.name },
      });
      if (existing) {
        throw new AppError(
          `Ya existe una saga con el nombre '${dto.name}'`,
          409,
        );
      }
      saga.name = dto.name;
    }

    if (dto.description !== undefined) {
      saga.description = dto.description;
    }

    const updated = await this.sagaRepository.save(saga);
    logger.info(`Saga actualizada: ID=${id}, Nombre='${updated.name}'`);
    return updated;
  }

  async delete(id: number): Promise<void> {
    const saga = await this.sagaRepository.findOne({ where: { id } });
    if (!saga) {
      throw new AppError(`Saga con ID ${id} no encontrada`, 404);
    }

    // Al eliminar una saga, los libros asociados quedan sin saga (SET NULL)
    const bookCount = await this.bookRepository.count({
      where: { sagaId: id },
    });
    if (bookCount > 0) {
      logger.info(
        `Saga '${saga.name}' eliminada. ${bookCount} libro(s) quedarán sin saga.`,
      );
    }

    await this.sagaRepository.remove(saga);
    logger.info(`Saga eliminada: ID=${id}, Nombre='${saga.name}'`);
  }
}
