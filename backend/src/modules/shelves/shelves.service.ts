import { AppDataSource } from '../../config/data-source';
import { Shelf } from './shelf.entity';
import { AppError } from '../../shared/errors/app-error';
import { HttpStatus } from '../../shared/constants/http-status';
import { Messages } from '../../shared/constants/messages';

export class ShelvesService {
  private repo = AppDataSource.getRepository(Shelf);

  async findAll(): Promise<Shelf[]> {
    return this.repo.find({
      relations: ['books'],
      order: { code: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Shelf> {
    const shelf = await this.repo.findOne({
      where: { id },
      relations: ['books'],
    });

    if (!shelf) {
      throw new AppError('Estante no encontrado.', HttpStatus.NOT_FOUND);
    }

    return shelf;
  }

  async create(data: { code: string; location: string; description?: string }): Promise<Shelf> {
    const existing = await this.repo.findOne({ where: { code: data.code.trim() } });
    if (existing) {
      throw new AppError('Ya existe un estante registrado con ese código.', HttpStatus.CONFLICT);
    }

    const shelf = this.repo.create({
      code: data.code.trim(),
      location: data.location.trim(),
      description: data.description ? data.description.trim() : undefined,
    });

    return this.repo.save(shelf);
  }

  async update(id: number, data: { code?: string; location?: string; description?: string }): Promise<Shelf> {
    const shelf = await this.findOne(id);

    if (data.code) {
      const existingCode = await this.repo.findOne({ where: { code: data.code.trim() } });
      if (existingCode && existingCode.id !== id) {
        throw new AppError('Ya existe otro estante registrado con ese código.', HttpStatus.CONFLICT);
      }
      shelf.code = data.code.trim();
    }

    if (data.location) {
      shelf.location = data.location.trim();
    }

    if (data.description !== undefined) {
      shelf.description = data.description.trim();
    }

    return this.repo.save(shelf);
  }

  async remove(id: number): Promise<void> {
    const shelf = await this.repo.findOne({
      where: { id },
      relations: ['books'],
    });

    if (!shelf) {
      throw new AppError('Estante no encontrado.', HttpStatus.NOT_FOUND);
    }

    // Regla de integridad referencial: No eliminar estante con libros asociados
    if (shelf.books && shelf.books.length > 0) {
      throw new AppError(Messages.CONFLICT_ASSOCIATED_BOOKS, HttpStatus.CONFLICT);
    }

    await this.repo.remove(shelf);
  }
}