import { Request, Response } from "express";
import { GenresService } from "./genres.service";
import { asyncHandler } from "../../shared/utils/async-handler";
import { HTTP_STATUS } from "../../shared/constants/http-status";

export class GenresController {
  // Instanciamos el servicio directamente para una lectura más limpia
  private genresService = new GenresService();

  // GET /genres -> Lista todos los géneros (ej: Fantasía, Ciencia Ficción)
  list = asyncHandler(async (req: Request, res: Response) => {
    // Simplificamos la lectura de los parámetros de búsqueda y paginación
    const search = req.query.search as string | undefined;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const result = await this.genresService.findAll({ search, page, limit });
    
    res.status(HTTP_STATUS.OK).json(result);
  });

  // GET /genres/:id -> Busca un género específico por su ID
  getById = asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id); // Captura el ID desde la ruta de la URL
    const genre = await this.genresService.findById(id);

    res.status(HTTP_STATUS.OK).json(genre);
  });

  // POST /genres -> Crea un nuevo género
  create = asyncHandler(async (req: Request, res: Response) => {
    // req.body contiene los datos que envió el usuario (ej: { "name": "Terror" })
    const genre = await this.genresService.create(req.body); 

    res.status(HTTP_STATUS.CREATED).json(genre); // 201 (CREATED)
  });

  // PUT /genres/:id -> Modifica el nombre o datos de un género existente
  update = asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const genre = await this.genresService.update(id, req.body);

    res.status(HTTP_STATUS.OK).json(genre);
  });

  // DELETE /genres/:id -> Elimina un género de la base de datos
  delete = asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    await this.genresService.delete(id);

    // 204 (NO_CONTENT): Se borró correctamente y no hay nada más que decir
    res.status(HTTP_STATUS.NO_CONTENT).send(); 
  });
}