import { Repository, ILike } from 'typeorm'; // Se reemplaza 'Like' por 'ILike' para búsquedas insensibles a mayúsculas
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
  // Se obtiene el repositorio bajo demanda para evitar errores si la DB no se inicializó al instanciar la clase
  private get authorRepository(): Repository<Author> {
    return AppDataSource.getRepository(Author);
  }

  private get bookRepository(): Repository<Book> {
    return AppDataSource.getRepository(Book);
  }

  async findAll(params: ListAuthorsParams) {
    const page = Math.max(1, Number(params.page) || 1); // Garantiza coerción numérica limpia
    const limit = Math.max(1, Math.min(100, Number(params.limit) || 10)); // Limita máximo 100 por página
    const skip = (page - 1) * limit;

    const where = params.search
      ? [{ name: ILike(`%${params.search}%`) }] // Búsqueda flexible case-insensitive
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
      relations: {
        books: true, // ✅ Sintaxis de objeto booleano corregida para evitar TypeORMError
      },
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