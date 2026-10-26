import { Request, Response } from "express";
import { GenresService } from "./genres.service";
import { asyncHandler } from "../../shared/utils/async-handler";
import { HTTP_STATUS } from "../../shared/constants/http-status";

export class GenresController {
  private readonly genresService: GenresService;

  constructor(genresService?: GenresService) {
    this.genresService = genresService ?? new GenresService();
  }

  list = asyncHandler(async (req: Request, res: Response) => {
    const { search, page, limit } = req.query;

    const result = await this.genresService.findAll({
      search: typeof search === "string" ? search : undefined,
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 10,
    });

    res.status(HTTP_STATUS.OK).json(result);
  });

  getById = asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const genre = await this.genresService.findById(id);

    res.status(HTTP_STATUS.OK).json(genre);
  });

  create = asyncHandler(async (req: Request, res: Response) => {
    const genre = await this.genresService.create(req.body);

    res.status(HTTP_STATUS.CREATED).json(genre);
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const genre = await this.genresService.update(id, req.body);

    res.status(HTTP_STATUS.OK).json(genre);
  });

  delete = asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    await this.genresService.delete(id);

    res.status(HTTP_STATUS.NO_CONTENT).send();
  });
}
