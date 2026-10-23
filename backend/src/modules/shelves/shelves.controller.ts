import { Request, Response } from 'express';
import { ShelvesService } from './shelves.service';
import { asyncHandler } from '../../shared/utils/async-handler';
import { HTTP_STATUS } from '../../shared/constants/http-status';

export class ShelvesController {
  private shelvesService: ShelvesService;

  constructor() {
    this.shelvesService = new ShelvesService();
  }

  list = asyncHandler(async (req: Request, res: Response) => {
    const { search, page, limit } = req.query as any;
    const result = await this.shelvesService.findAll({
      search: search || undefined,
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 10,
    });
    res.status(HTTP_STATUS.OK).json(result);
  });

  getById = asyncHandler(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);
    const shelf = await this.shelvesService.findById(id);
    res.status(HTTP_STATUS.OK).json(shelf);
  });

  create = asyncHandler(async (req: Request, res: Response) => {
    const shelf = await this.shelvesService.create(req.body);
    res.status(HTTP_STATUS.CREATED).json(shelf);
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);
    const shelf = await this.shelvesService.update(id, req.body);
    res.status(HTTP_STATUS.OK).json(shelf);
  });

  delete = asyncHandler(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);
    await this.shelvesService.delete(id);
    res.status(HTTP_STATUS.NO_CONTENT).send();
  });
}