import { Request, Response } from "express";
import { SagasService } from "./sagas.service";
import { asyncHandler } from "../../shared/utils/async-handler";
import { HTTP_STATUS } from "../../shared/constants/http-status";

export class SagasController {
  private readonly sagasService: SagasService;

  constructor(sagasService?: SagasService) {
    this.sagasService = sagasService ?? new SagasService();
  }

  list = asyncHandler(async (req: Request, res: Response) => {
    const { search, page, limit } = req.query;

    const result = await this.sagasService.findAll({
      search: typeof search === "string" ? search : undefined,
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 10,
    });

    res.status(HTTP_STATUS.OK).json(result);
  });

  getById = asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const saga = await this.sagasService.findById(id);

    res.status(HTTP_STATUS.OK).json(saga);
  });

  create = asyncHandler(async (req: Request, res: Response) => {
    const saga = await this.sagasService.create(req.body);

    res.status(HTTP_STATUS.CREATED).json(saga);
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const saga = await this.sagasService.update(id, req.body);

    res.status(HTTP_STATUS.OK).json(saga);
  });

  delete = asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    await this.sagasService.delete(id);

    res.status(HTTP_STATUS.NO_CONTENT).send();
  });
}
