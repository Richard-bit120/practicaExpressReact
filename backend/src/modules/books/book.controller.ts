import { Request, Response } from 'express';
import { BooksService } from './book.service';
import { HttpStatus } from '../../shared/constants/http-status';
import { IBookFilters } from './book.types';

export class BooksController {
  private booksService = new BooksService();

  getAll = async (req: Request, res: Response): Promise<Response> => {
    const filters: IBookFilters = {
      genreId: req.query.genreId as string,
      authorId: req.query.authorId as string,
      sagaId: req.query.sagaId as string,
      year: req.query.year as string,
    };

    const books = await this.booksService.findAll(filters);
    return res.status(HttpStatus.OK).json({ success: true, data: books });
  };

  getOne = async (req: Request, res: Response): Promise<Response> => {
    const id = Number(req.params.id);
    const book = await this.booksService.findOne(id);
    return res.status(HttpStatus.OK).json({ success: true, data: book });
  };

  create = async (req: Request, res: Response): Promise<Response> => {
    const book = await this.booksService.create(req.body);
    return res.status(HttpStatus.CREATED).json({ success: true, data: book });
  };

  update = async (req: Request, res: Response): Promise<Response> => {
    const id = Number(req.params.id);
    const book = await this.booksService.update(id, req.body);
    return res.status(HttpStatus.OK).json({ success: true, data: book });
  };

  delete = async (req: Request, res: Response): Promise<Response> => {
    const id = Number(req.params.id);
    await this.booksService.remove(id);
    return res.status(HttpStatus.NO_CONTENT).send();
  };
}