import { Request, Response } from "express";
import { SagasService } from "./sagas.service";
import { asyncHandler } from "../../shared/utils/async-handler";
import { HTTP_STATUS } from "../../shared/constants/http-status";

export class SagasController {
  // Instanciamos el servicio directamente para eliminar el constructor redundante
  private sagasService = new SagasService();

  // GET /sagas -> Lista las sagas con búsqueda y paginación
  list = asyncHandler(async (req: Request, res: Response) => {
    // Lectura directa y limpia de los parámetros de consulta
    const search = req.query.search as string | undefined;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const result = await this.sagasService.findAll({ search, page, limit });

    res.status(HTTP_STATUS.OK).json(result);
  });

  // GET /sagas/:id -> Obtiene una saga por su ID
  getById = asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const saga = await this.sagasService.findById(id);

    res.status(HTTP_STATUS.OK).json(saga);
  });

  // POST /sagas -> Crea una nueva saga (ej: "Harry Potter", "Fundación")
  create = asyncHandler(async (req: Request, res: Response) => {
    const saga = await this.sagasService.create(req.body);

    res.status(HTTP_STATUS.CREATED).json(saga);
  });

  // PUT /sagas/:id -> Actualiza una saga existente
  update = asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const saga = await this.sagasService.update(id, req.body);

    res.status(HTTP_STATUS.OK).json(saga);
  });

  // DELETE /sagas/:id -> Elimina una saga
  delete = asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    await this.sagasService.delete(id);

    res.status(HTTP_STATUS.NO_CONTENT).send();
  });
}