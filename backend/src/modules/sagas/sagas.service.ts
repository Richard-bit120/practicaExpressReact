import { AppDataSource } from '../../config/data-source';
import { Saga } from './saga.entity';
import { Book } from '../books/book.entity';
import { AppError } from '../../shared/errors/app-error';
import { HttpStatus } from '../../shared/constants/http-status';

export class SagasService {
  private sagaRepo = AppDataSource.getRepository(Saga);
  private bookRepo = AppDataSource.getRepository(Book);

  async findAll(): Promise<Saga[]> {
    return this.sagaRepo.find({
      relations: ['books'],
      order: { name: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Saga> {
    const saga = await this.sagaRepo.findOne({
      where: { id },
      relations: ['books'],
    });

    if (!saga) {
      throw new AppError('Saga no encontrada.', HttpStatus.NOT_FOUND);
    }

    return saga;
  }

  async create(data: { name: string; description?: string }): Promise<Saga> {
    const existing = await this.sagaRepo.findOne({ where: { name: data.name.trim() } });
    if (existing) {
      throw new AppError('Ya existe una saga registrada con ese nombre.', HttpStatus.CONFLICT);
    }

    const saga = this.sagaRepo.create({
      name: data.name.trim(),
      description: data.description ? data.description.trim() : undefined,
    });

    return this.sagaRepo.save(saga);
  }

  async update(id: number, data: { name?: string; description?: string }): Promise<Saga> {
    const saga = await this.findOne(id);

    if (data.name) {
      const existingName = await this.sagaRepo.findOne({ where: { name: data.name.trim() } });
      if (existingName && existingName.id !== id) {
        throw new AppError('Ya existe otra saga registrada con ese nombre.', HttpStatus.CONFLICT);
      }
      saga.name = data.name.trim();
    }

    if (data.description !== undefined) {
      saga.description = data.description.trim();
    }

    return this.sagaRepo.save(saga);
  }

  async remove(id: number): Promise<void> {
    const saga = await this.findOne(id);

    // Desvincular libros asociados de forma explícita antes de eliminar
    await this.bookRepo.update({ sagaId: id }, { sagaId: undefined, saga: undefined });

    await this.sagaRepo.remove(saga);
  }
}