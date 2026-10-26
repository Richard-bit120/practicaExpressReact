import { Request, Response } from "express";
import { BooksService } from "./books.service";
import { asyncHandler } from "../../shared/utils/async-handler";
import { HTTP_STATUS } from "../../shared/constants/http-status";

export class BooksController {
  private readonly booksService: BooksService;

  constructor(booksService?: BooksService) {
    this.booksService = booksService ?? new BooksService();
  }

  list = asyncHandler(async (req: Request, res: Response) => {
    const { search, authorId, genreId, shelfId, sagaId, year, page, limit } =
      req.query;

    const result = await this.booksService.findAll({
      search: typeof search === "string" ? search : undefined,
      authorId: authorId ? Number(authorId) : undefined,
      genreId: genreId ? Number(genreId) : undefined,
      shelfId: shelfId ? Number(shelfId) : undefined,
      sagaId: sagaId ? Number(sagaId) : undefined,
      year: year ? Number(year) : undefined,
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 10,
    });

    res.status(HTTP_STATUS.OK).json(result);
  });

  getById = asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const book = await this.booksService.findById(id);

    res.status(HTTP_STATUS.OK).json(book);
  });

  create = asyncHandler(async (req: Request, res: Response) => {
    const book = await this.booksService.create(req.body);

    res.status(HTTP_STATUS.CREATED).json(book);
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const book = await this.booksService.update(id, req.body);

    res.status(HTTP_STATUS.OK).json(book);
  });

  delete = asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    await this.booksService.delete(id);

    res.status(HTTP_STATUS.NO_CONTENT).send();
  });
}
