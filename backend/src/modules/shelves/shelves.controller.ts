import { Request, Response } from "express";
import { ShelvesService } from "./shelves.service";
import { asyncHandler } from "../../shared/utils/async-handler";
import { HTTP_STATUS } from "../../shared/constants/http-status";

export class ShelvesController {
  // Instanciamos el servicio directamente para eliminar el constructor innecesario
  private shelvesService = new ShelvesService();

  // GET /shelves -> Lista los estantes/estanterías
  list = asyncHandler(async (req: Request, res: Response) => {
    // Lectura directa de parámetros con fallbacks limpios (||)
    const search = req.query.search as string | undefined;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const result = await this.shelvesService.findAll({ search, page, limit });

    res.status(HTTP_STATUS.OK).json(result);
  });

  // GET /shelves/:id -> Obtiene un estante por su ID
  getById = asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const shelf = await this.shelvesService.findById(id);

    res.status(HTTP_STATUS.OK).json(shelf);
  });

  // POST /shelves -> Crea un nuevo estante
  create = asyncHandler(async (req: Request, res: Response) => {
    const shelf = await this.shelvesService.create(req.body);

    res.status(HTTP_STATUS.CREATED).json(shelf);
  });

  // PUT /shelves/:id -> Actualiza un estante
  update = asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const shelf = await this.shelvesService.update(id, req.body);

    res.status(HTTP_STATUS.OK).json(shelf);
  });

  // DELETE /shelves/:id -> Elimina un estante
  delete = asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    await this.shelvesService.delete(id);

    res.status(HTTP_STATUS.NO_CONTENT).send();
  });
}