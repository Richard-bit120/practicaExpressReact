import { Request, Response } from 'express';
import { SagasService } from './sagas.service';
import { asyncHandler } from '../../shared/utils/async-handler';
import { HTTP_STATUS } from '../../shared/constants/http-status';

export class SagasController {
  private sagasService: SagasService;

  constructor() {
    this.sagasService = new SagasService();
  }

  list = asyncHandler(async (req: Request, res: Response) => {
    const { search, page, limit } = req.query as any;
    const result = await this.sagasService.findAll({
      search: search || undefined,
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 10,
    });
    res.status(HTTP_STATUS.OK).json(result);
  });

  getById = asyncHandler(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);
    const saga = await this.sagasService.findById(id);
    res.status(HTTP_STATUS.OK).json(saga);
  });

  create = asyncHandler(async (req: Request, res: Response) => {
    const saga = await this.sagasService.create(req.body);
    res.status(HTTP_STATUS.CREATED).json(saga);
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);
    const saga = await this.sagasService.update(id, req.body);
    res.status(HTTP_STATUS.OK).json(saga);
  });

  delete = asyncHandler(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);
    await this.sagasService.delete(id);
    res.status(HTTP_STATUS.NO_CONTENT).send();
  });
}