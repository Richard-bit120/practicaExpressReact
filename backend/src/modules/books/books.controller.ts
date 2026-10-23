import { Request, Response } from 'express';
import { BooksService } from './books.service';
import { asyncHandler } from '../../shared/utils/async-handler';
import { HTTP_STATUS } from '../../shared/constants/http-status';

export class BooksController {
  private booksService: BooksService;

  constructor() {
    this.booksService = new BooksService();
  }

  list = asyncHandler(async (req: Request, res: Response) => {
    const { search, authorId, genreId, shelfId, sagaId, year, page, limit } = req.query as any;
    const result = await this.booksService.findAll({
      search: search || undefined,
      authorId: authorId ? parseInt(authorId, 10) : undefined,
      genreId: genreId ? parseInt(genreId, 10) : undefined,
      shelfId: shelfId ? parseInt(shelfId, 10) : undefined,
      sagaId: sagaId ? parseInt(sagaId, 10) : undefined,
      year: year ? parseInt(year, 10) : undefined,
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 10,
    });
    res.status(HTTP_STATUS.OK).json(result);
  });

  getById = asyncHandler(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);
    const book = await this.booksService.findById(id);
    res.status(HTTP_STATUS.OK).json(book);
  });

  create = asyncHandler(async (req: Request, res: Response) => {
    const book = await this.booksService.create(req.body);
    res.status(HTTP_STATUS.CREATED).json(book);
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);
    const book = await this.booksService.update(id, req.body);
    res.status(HTTP_STATUS.OK).json(book);
  });

  delete = asyncHandler(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);
    await this.booksService.delete(id);
    res.status(HTTP_STATUS.NO_CONTENT).send();
  });
}