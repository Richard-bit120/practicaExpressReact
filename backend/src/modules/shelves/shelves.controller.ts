import { Request, Response } from "express";
import { ShelvesService } from "./shelves.service";
import { asyncHandler } from "../../shared/utils/async-handler";
import { HTTP_STATUS } from "../../shared/constants/http-status";

export class ShelvesController {
  private readonly shelvesService: ShelvesService;

  constructor(shelvesService?: ShelvesService) {
    this.shelvesService = shelvesService ?? new ShelvesService();
  }

  list = asyncHandler(async (req: Request, res: Response) => {
    const { search, page, limit } = req.query;

    const result = await this.shelvesService.findAll({
      search: typeof search === "string" ? search : undefined,
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 10,
    });

    res.status(HTTP_STATUS.OK).json(result);
  });

  getById = asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const shelf = await this.shelvesService.findById(id);

    res.status(HTTP_STATUS.OK).json(shelf);
  });

  create = asyncHandler(async (req: Request, res: Response) => {
    const shelf = await this.shelvesService.create(req.body);

    res.status(HTTP_STATUS.CREATED).json(shelf);
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const shelf = await this.shelvesService.update(id, req.body);

    res.status(HTTP_STATUS.OK).json(shelf);
  });

  delete = asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    await this.shelvesService.delete(id);

    res.status(HTTP_STATUS.NO_CONTENT).send();
  });
}
