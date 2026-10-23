import { Repository, Like } from 'typeorm';
import { AppDataSource } from '../../config/data-source';
import { Shelf } from './shelf.entity';
import { Book } from '../books/book.entity';
import { AppError } from '../../shared/errors/app-error';
import { logger } from '../../shared/logging/logger';

interface CreateShelfDto {
  code: string;
  location?: string | null;
  description?: string | null;
}

interface UpdateShelfDto {
  code?: string;
  location?: string | null;
  description?: string | null;
}

interface ListShelvesParams {
  search?: string;
  page?: number;
  limit?: number;
}

export class ShelvesService {
  private shelfRepository: Repository<Shelf>;
  private bookRepository: Repository<Book>;

  constructor() {
    this.shelfRepository = AppDataSource.getRepository(Shelf);
    this.bookRepository = AppDataSource.getRepository(Book);
  }

  async findAll(params: ListShelvesParams) {
    const { search, page = 1, limit = 10 } = params;
    const skip = (page - 1) * limit;

    const where = search
      ? [
          { code: Like(`%${search}%`) },
          { location: Like(`%${search}%`) },
        ]
      : {};

    const [shelves, total] = await this.shelfRepository.findAndCount({
      where,
      order: { code: 'ASC' },
      skip,
      take: limit,
    });

    return {
      data: shelves,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findById(id: number): Promise<Shelf> {
    const shelf = await this.shelfRepository.findOne({
      where: { id },
      relations: ['books'],
    });
    if (!shelf) {
      throw new AppError(`Estante con ID ${id} no encontrado`, 404);
    }
    return shelf;
  }

  async create(dto: CreateShelfDto): Promise<Shelf> {
    const existing = await this.shelfRepository.findOne({ where: { code: dto.code } });
    if (existing) {
      throw new AppError(`Ya existe un estante con el código '${dto.code}'`, 409);
    }

    const shelf = this.shelfRepository.create({
      code: dto.code,
      location: dto.location ?? null,
      description: dto.description ?? null,
    });

    const saved = await this.shelfRepository.save(shelf);
    logger.info(`Estante creado: ID=${saved.id}, Código='${saved.code}'`);
    return saved;
  }

  async update(id: number, dto: UpdateShelfDto): Promise<Shelf> {
    const shelf = await this.shelfRepository.findOne({ where: { id } });
    if (!shelf) {
      throw new AppError(`Estante con ID ${id} no encontrado`, 404);
    }

    if (dto.code && dto.code !== shelf.code) {
      const existing = await this.shelfRepository.findOne({ where: { code: dto.code } });
      if (existing) {
        throw new AppError(`Ya existe un estante con el código '${dto.code}'`, 409);
      }
      shelf.code = dto.code;
    }

    if (dto.location !== undefined) shelf.location = dto.location;
    if (dto.description !== undefined) shelf.description = dto.description;

    const updated = await this.shelfRepository.save(shelf);
    logger.info(`Estante actualizado: ID=${id}, Código='${updated.code}'`);
    return updated;
  }

  async delete(id: number): Promise<void> {
    const shelf = await this.shelfRepository.findOne({ where: { id } });
    if (!shelf) {
      throw new AppError(`Estante con ID ${id} no encontrado`, 404);
    }

    const bookCount = await this.bookRepository.count({ where: { shelfId: id } });
    if (bookCount > 0) {
      throw new AppError(
        `No se puede eliminar el estante '${shelf.code}' porque tiene ${bookCount} libro(s) asociado(s)`,
        409
      );
    }

    await this.shelfRepository.remove(shelf);
    logger.info(`Estante eliminado: ID=${id}, Código='${shelf.code}'`);
  }
}