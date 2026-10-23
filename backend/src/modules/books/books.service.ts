import { Repository, Like, FindOptionsWhere } from 'typeorm';
import { AppDataSource } from '../../config/data-source';
import { Book } from './book.entity';
import { Author } from '../authors/author.entity';
import { Genre } from '../genres/genre.entity';
import { Shelf } from '../shelves/shelf.entity';
import { Saga } from '../sagas/saga.entity';
import { AppError } from '../../shared/errors/app-error';
import { logger } from '../../shared/logging/logger';

interface CreateBookDto {
  title: string;
  isbn?: string | null;
  year?: number | null;
  authorId: number;
  genreId: number;
  shelfId: number;
  sagaId?: number | null;
}

interface UpdateBookDto {
  title?: string;
  isbn?: string | null;
  year?: number | null;
  authorId?: number;
  genreId?: number;
  shelfId?: number;
  sagaId?: number | null;
}

interface ListBooksParams {
  search?: string;
  authorId?: number;
  genreId?: number;
  shelfId?: number;
  sagaId?: number;
  year?: number;
  page?: number;
  limit?: number;
}

export class BooksService {
  private bookRepository: Repository<Book>;
  private authorRepository: Repository<Author>;
  private genreRepository: Repository<Genre>;
  private shelfRepository: Repository<Shelf>;
  private sagaRepository: Repository<Saga>;

  constructor() {
    this.bookRepository = AppDataSource.getRepository(Book);
    this.authorRepository = AppDataSource.getRepository(Author);
    this.genreRepository = AppDataSource.getRepository(Genre);
    this.shelfRepository = AppDataSource.getRepository(Shelf);
    this.sagaRepository = AppDataSource.getRepository(Saga);
  }

  private async validateRelations(dto: {
    authorId?: number;
    genreId?: number;
    shelfId?: number;
    sagaId?: number | null;
  }): Promise<void> {
    if (dto.authorId) {
      const author = await this.authorRepository.findOne({ where: { id: dto.authorId } });
      if (!author) {
        throw new AppError(`El autor con ID ${dto.authorId} no existe`, 400);
      }
    }

    if (dto.genreId) {
      const genre = await this.genreRepository.findOne({ where: { id: dto.genreId } });
      if (!genre) {
        throw new AppError(`El género con ID ${dto.genreId} no existe`, 400);
      }
    }

    if (dto.shelfId) {
      const shelf = await this.shelfRepository.findOne({ where: { id: dto.shelfId } });
      if (!shelf) {
        throw new AppError(`El estante con ID ${dto.shelfId} no existe`, 400);
      }
    }

    if (dto.sagaId !== undefined && dto.sagaId !== null) {
      const saga = await this.sagaRepository.findOne({ where: { id: dto.sagaId } });
      if (!saga) {
        throw new AppError(`La saga con ID ${dto.sagaId} no existe`, 400);
      }
    }
  }

  async findAll(params: ListBooksParams) {
    const { search, authorId, genreId, shelfId, sagaId, year, page = 1, limit = 10 } = params;
    const skip = (page - 1) * limit;

    // Construir filtros combinables
    const where: FindOptionsWhere<Book> = {};

    if (search) {
      // Búsqueda por título se maneja con QueryBuilder
    }
    if (authorId) where.authorId = authorId;
    if (genreId) where.genreId = genreId;
    if (shelfId) where.shelfId = shelfId;
    if (sagaId) where.sagaId = sagaId;
    if (year) where.year = year;

    const queryBuilder = this.bookRepository
      .createQueryBuilder('book')
      .leftJoinAndSelect('book.author', 'author')
      .leftJoinAndSelect('book.genre', 'genre')
      .leftJoinAndSelect('book.shelf', 'shelf')
      .leftJoinAndSelect('book.saga', 'saga')
      .orderBy('book.title', 'ASC')
      .skip(skip)
      .take(limit);

    // Aplicar filtros de relaciones
    if (authorId) queryBuilder.andWhere('book.authorId = :authorId', { authorId });
    if (genreId) queryBuilder.andWhere('book.genreId = :genreId', { genreId });
    if (shelfId) queryBuilder.andWhere('book.shelfId = :shelfId', { shelfId });
    if (sagaId) queryBuilder.andWhere('book.sagaId = :sagaId', { sagaId });
    if (year) queryBuilder.andWhere('book.year = :year', { year });

    // Búsqueda por título
    if (search) {
      queryBuilder.andWhere('book.title LIKE :search', { search: `%${search}%` });
    }

    const [books, total] = await queryBuilder.getManyAndCount();

    return {
      data: books,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findById(id: number): Promise<Book> {
    const book = await this.bookRepository
      .createQueryBuilder('book')
      .leftJoinAndSelect('book.author', 'author')
      .leftJoinAndSelect('book.genre', 'genre')
      .leftJoinAndSelect('book.shelf', 'shelf')
      .leftJoinAndSelect('book.saga', 'saga')
      .where('book.id = :id', { id })
      .getOne();

    if (!book) {
      throw new AppError(`Libro con ID ${id} no encontrado`, 404);
    }

    return book;
  }

  async create(dto: CreateBookDto): Promise<Book> {
    // Validar que las relaciones existan
    await this.validateRelations({
      authorId: dto.authorId,
      genreId: dto.genreId,
      shelfId: dto.shelfId,
      sagaId: dto.sagaId,
    });

    const book = this.bookRepository.create({
      title: dto.title,
      isbn: dto.isbn ?? null,
      year: dto.year ?? null,
      authorId: dto.authorId,
      genreId: dto.genreId,
      shelfId: dto.shelfId,
      sagaId: dto.sagaId ?? null,
    });

    const saved = await this.bookRepository.save(book);
    logger.info(`Libro creado: ID=${saved.id}, Título='${saved.title}'`);
    return this.findById(saved.id);
  }

  async update(id: number, dto: UpdateBookDto): Promise<Book> {
    const book = await this.bookRepository.findOne({ where: { id } });
    if (!book) {
      throw new AppError(`Libro con ID ${id} no encontrado`, 404);
    }

    // Validar relaciones si se están actualizando
    await this.validateRelations({
      authorId: dto.authorId,
      genreId: dto.genreId,
      shelfId: dto.shelfId,
      sagaId: dto.sagaId,
    });

    if (dto.title !== undefined) book.title = dto.title;
    if (dto.isbn !== undefined) book.isbn = dto.isbn;
    if (dto.year !== undefined) book.year = dto.year;
    if (dto.authorId !== undefined) book.authorId = dto.authorId;
    if (dto.genreId !== undefined) book.genreId = dto.genreId;
    if (dto.shelfId !== undefined) book.shelfId = dto.shelfId;
    if (dto.sagaId !== undefined) book.sagaId = dto.sagaId;

    const updated = await this.bookRepository.save(book);
    logger.info(`Libro actualizado: ID=${id}, Título='${updated.title}'`);
    return this.findById(id);
  }

  async delete(id: number): Promise<void> {
    const book = await this.bookRepository.findOne({ where: { id } });
    if (!book) {
      throw new AppError(`Libro con ID ${id} no encontrado`, 404);
    }

    await this.bookRepository.remove(book);
    logger.info(`Libro eliminado: ID=${id}, Título='${book.title}'`);
  }
}