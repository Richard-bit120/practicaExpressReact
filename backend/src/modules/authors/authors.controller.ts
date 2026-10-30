import { Request, Response } from "express";
import { AuthorsService } from "./authors.service";
import { asyncHandler } from "../../shared/utils/async-handler";
import { HTTP_STATUS } from "../../shared/constants/http-status";

export class AuthorsController {
  // 1. Instanciamos el servicio directamente. Es más directo y fácil de leer
  // que usar un constructor complejo.
  private authorsService = new AuthorsService();

  // GET /authors -> Lista todos los autores
  list = asyncHandler(async (req: Request, res: Response) => {
    // Simplificamos los valores por defecto usando el operador || (OR)
    const search = req.query.search as string | undefined;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const result = await this.authorsService.findAll({ search, page, limit });
    
    res.status(HTTP_STATUS.OK).json(result);
  });

  // GET /authors/:id -> Busca un autor por su ID
  getById = asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id); // Extraemos el ID de la URL
    const author = await this.authorsService.findById(id);

    res.status(HTTP_STATUS.OK).json(author);
  });

  // POST /authors -> Crea un nuevo autor
  create = asyncHandler(async (req: Request, res: Response) => {
    const author = await this.authorsService.create(req.body); // req.body tiene los datos enviados

    res.status(HTTP_STATUS.CREATED).json(author); // CREATED suele ser código 201
  });

  // PUT /authors/:id -> Actualiza un autor existente
  update = asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const author = await this.authorsService.update(id, req.body);

    res.status(HTTP_STATUS.OK).json(author);
  });

  // DELETE /authors/:id -> Elimina un autor
  delete = asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    await this.authorsService.delete(id);

    // NO_CONTENT (204) significa "Todo salió bien pero no tengo datos para devolverte"
    res.status(HTTP_STATUS.NO_CONTENT).send(); 
  });
}