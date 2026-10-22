import { AppDataSource } from '../../config/data-source';
import { Author } from './author.entity';
import { AppError } from '../../shared/errors/app-error';
import { HttpStatus } from '../../shared/constants/http-status';
import { Messages } from '../../shared/constants/messages';

export class AuthorsService {
  private repo = AppDataSource.getRepository(Author);

  async findAll(): Promise<Author[]> {
    return this.repo.find({
      relations: ['books'],
      order: { name: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Author> {
    const author = await this.repo.findOne({
      where: { id },
      relations: ['books'],
    });

    if (!author) {
      throw new AppError('Autor no encontrado.', HttpStatus.NOT_FOUND);
    }

    return author;
  }

  async create(data: { name: string; bio?: string }): Promise<Author> {
    const existingAuthor = await this.repo.findOne({ where: { name: data.name.trim() } });
    if (existingAuthor) {
      throw new AppError('Ya existe un autor registrado con ese nombre.', HttpStatus.CONFLICT);
    }

    const author = this.repo.create({
      name: data.name.trim(),
      bio: data.bio ? data.bio.trim() : undefined,
    });

    return this.repo.save(author);
  }

  async update(id: number, data: { name?: string; bio?: string }): Promise<Author> {
    const author = await this.findOne(id);

    if (data.name) {
      const existingName = await this.repo.findOne({ where: { name: data.name.trim() } });
      if (existingName && existingName.id !== id) {
        throw new AppError('Ya existe otro autor registrado con ese nombre.', HttpStatus.CONFLICT);
      }
      author.name = data.name.trim();
    }

    if (data.bio !== undefined) {
      author.bio = data.bio.trim();
    }

    return this.repo.save(author);
  }

  async remove(id: number): Promise<void> {
    const author = await this.repo.findOne({
      where: { id },
      relations: ['books'],
    });

    if (!author) {
      throw new AppError('Autor no encontrado.', HttpStatus.NOT_FOUND);
    }

    // Regla de integridad referencial: Impedir eliminación si tiene libros asociados
    if (author.books && author.books.length > 0) {
      throw new AppError(Messages.CONFLICT_ASSOCIATED_BOOKS, HttpStatus.CONFLICT);
    }

    await this.repo.remove(author);
  }
}