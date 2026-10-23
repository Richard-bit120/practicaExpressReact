import { Request, Response } from 'express';
import { AuthorsService } from './authors.service';
import { asyncHandler } from '../../shared/utils/async-handler';
import { HTTP_STATUS } from '../../shared/constants/http-status';

export class AuthorsController {
  private authorsService: AuthorsService;

  constructor() {
    this.authorsService = new AuthorsService();
  }

  list = asyncHandler(async (req: Request, res: Response) => {
    const { search, page, limit } = req.query as any;
    const result = await this.authorsService.findAll({
      search: search || undefined,
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 10,
    });
    res.status(HTTP_STATUS.OK).json(result);
  });

  getById = asyncHandler(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);
    const author = await this.authorsService.findById(id);
    res.status(HTTP_STATUS.OK).json(author);
  });

  create = asyncHandler(async (req: Request, res: Response) => {
    const author = await this.authorsService.create(req.body);
    res.status(HTTP_STATUS.CREATED).json(author);
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);
    const author = await this.authorsService.update(id, req.body);
    res.status(HTTP_STATUS.OK).json(author);
  });

  delete = asyncHandler(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);
    await this.authorsService.delete(id);
    res.status(HTTP_STATUS.NO_CONTENT).send();
  });
}