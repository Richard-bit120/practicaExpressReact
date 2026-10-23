import { Request, Response } from 'express';
import { GenresService } from './genres.service';
import { asyncHandler } from '../../shared/utils/async-handler';
import { HTTP_STATUS } from '../../shared/constants/http-status';

export class GenresController {
  private genresService: GenresService;

  constructor() {
    this.genresService = new GenresService();
  }

  list = asyncHandler(async (req: Request, res: Response) => {
    const { search, page, limit } = req.query as any;
    const result = await this.genresService.findAll({
      search: search || undefined,
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 10,
    });
    res.status(HTTP_STATUS.OK).json(result);
  });

  getById = asyncHandler(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);
    const genre = await this.genresService.findById(id);
    res.status(HTTP_STATUS.OK).json(genre);
  });

  create = asyncHandler(async (req: Request, res: Response) => {
    const genre = await this.genresService.create(req.body);
    res.status(HTTP_STATUS.CREATED).json(genre);
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);
    const genre = await this.genresService.update(id, req.body);
    res.status(HTTP_STATUS.OK).json(genre);
  });

  delete = asyncHandler(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);
    await this.genresService.delete(id);
    res.status(HTTP_STATUS.NO_CONTENT).send();
  });
}