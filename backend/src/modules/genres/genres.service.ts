import { AppDataSource } from '../../config/data-source';
import { Genre } from './genre.entity';
import { AppError } from '../../shared/errors/app-error';
import { HttpStatus } from '../../shared/constants/http-status';
import { Messages } from '../../shared/constants/messages';

export class GenresService {
  private repo = AppDataSource.getRepository(Genre);

  async findAll(): Promise<Genre[]> {
    return this.repo.find({
      relations: ['books'],
      order: { name: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Genre> {
    const genre = await this.repo.findOne({
      where: { id },
      relations: ['books'],
    });

    if (!genre) {
      throw new AppError('Género no encontrado.', HttpStatus.NOT_FOUND);
    }

    return genre;
  }

  async create(data: { name: string; description?: string }): Promise<Genre> {
    const existingGenre = await this.repo.findOne({ where: { name: data.name.trim() } });
    if (existingGenre) {
      throw new AppError('Ya existe un género registrado con ese nombre.', HttpStatus.CONFLICT);
    }

    const genre = this.repo.create({
      name: data.name.trim(),
      description: data.description ? data.description.trim() : undefined,
    });

    return this.repo.save(genre);
  }

  async update(id: number, data: { name?: string; description?: string }): Promise<Genre> {
    const genre = await this.findOne(id);

    if (data.name) {
      const existingName = await this.repo.findOne({ where: { name: data.name.trim() } });
      if (existingName && existingName.id !== id) {
        throw new AppError('Ya existe otro género registrado con ese nombre.', HttpStatus.CONFLICT);
      }
      genre.name = data.name.trim();
    }

    if (data.description !== undefined) {
      genre.description = data.description.trim();
    }

    return this.repo.save(genre);
  }

  async remove(id: number): Promise<void> {
    const genre = await this.repo.findOne({
      where: { id },
      relations: ['books'],
    });

    if (!genre) {
      throw new AppError('Género no encontrado.', HttpStatus.NOT_FOUND);
    }

    // Regla de integridad: Impedir eliminación si hay libros asociados
    if (genre.books && genre.books.length > 0) {
      throw new AppError(Messages.CONFLICT_ASSOCIATED_BOOKS, HttpStatus.CONFLICT);
    }

    await this.repo.remove(genre);
  }
}