import { AppDataSource } from '../../config/data-source';
import { Book } from './book.entity';
import { Author } from '../authors/author.entity';
import { Genre } from '../genres/genre.entity';
import { Saga } from '../sagas/saga.entity';
import { Shelf } from '../shelves/shelf.entity';
import { AppError } from '../../shared/errors/app-error';
import { HttpStatus } from '../../shared/constants/http-status';

export class BooksService {
  private bookRepo = AppDataSource.getRepository(Book);
  private authorRepo = AppDataSource.getRepository(Author);
  private genreRepo = AppDataSource.getRepository(Genre);
  private sagaRepo = AppDataSource.getRepository(Saga);
  private shelfRepo = AppDataSource.getRepository(Shelf);

  async findAll(query: { genreId?: string; authorId?: string; year?: string; sagaId?: string }) {
    const qb = this.bookRepo.createQueryBuilder('book')
      .leftJoinAndSelect('book.author', 'author')
      .leftJoinAndSelect('book.genre', 'genre')
      .leftJoinAndSelect('book.saga', 'saga')
      .leftJoinAndSelect('book.shelf', 'shelf');

    if (query.genreId) {
      qb.andWhere('book.genreId = :genreId', { genreId: Number(query.genreId) });
    }
    if (query.authorId) {
      qb.andWhere('book.authorId = :authorId', { authorId: Number(query.authorId) });
    }
    if (query.year) {
      qb.andWhere('book.year = :year', { year: Number(query.year) });
    }
    if (query.sagaId) {
      qb.andWhere('book.sagaId = :sagaId', { sagaId: Number(query.sagaId) });
    }

    return qb.getMany();
  }

  async findOne(id: number) {
    const book = await this.bookRepo.findOne({
      where: { id },
      relations: ['author', 'genre', 'saga', 'shelf'],
    });
    if (!book) throw new AppError('Libro no encontrado.', HttpStatus.NOT_FOUND);
    return book;
  }

  async create(data: { title: string; isbn?: string; year?: number; authorId: number; genreId: number; shelfId: number; sagaId?: number }) {
    await this.validateRelations(data.authorId, data.genreId, data.shelfId, data.sagaId);
    const book = this.bookRepo.create(data);
    const saved = await this.bookRepo.save(book);
    return this.findOne(saved.id);
  }

  async update(id: number, data: any) {
    const book = await this.findOne(id);
    if (data.authorId || data.genreId || data.shelfId || data.sagaId) {
      await this.validateRelations(
        data.authorId || book.authorId,
        data.genreId || book.genreId,
        data.shelfId || book.shelfId,
        data.sagaId !== undefined ? data.sagaId : book.sagaId
      );
    }
    this.bookRepo.merge(book, data);
    await this.bookRepo.save(book);
    return this.findOne(id);
  }

  async remove(id: number) {
    const book = await this.findOne(id);
    await this.bookRepo.remove(book);
  }

  private async validateRelations(authorId: number, genreId: number, shelfId: number, sagaId?: number) {
    const author = await this.authorRepo.findOne({ where: { id: authorId } });
    if (!author) throw new AppError('El autor especificado no existe.', HttpStatus.BAD_REQUEST);

    const genre = await this.genreRepo.findOne({ where: { id: genreId } });
    if (!genre) throw new AppError('El género especificado no existe.', HttpStatus.BAD_REQUEST);

    const shelf = await this.shelfRepo.findOne({ where: { id: shelfId } });
    if (!shelf) throw new AppError('El estante especificado no existe.', HttpStatus.BAD_REQUEST);

    if (sagaId) {
      const saga = await this.sagaRepo.findOne({ where: { id: sagaId } });
      if (!saga) throw new AppError('La saga especificada no existe.', HttpStatus.BAD_REQUEST);
    }
  }
}