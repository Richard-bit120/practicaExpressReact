import { Request, Response } from "express";
import { BooksService } from "./books.service";
import { asyncHandler } from "../../shared/utils/async-handler";
import { HTTP_STATUS } from "../../shared/constants/http-status";

export class BooksController {
  // Instanciamos el servicio de forma directa y limpia
  private booksService = new BooksService();

  // GET /books -> Lista libros (con múltiples opciones de filtro)
  list = asyncHandler(async (req: Request, res: Response) => {
    // 1. Extraemos todos los posibles filtros de la URL
    const { search, authorId, genreId, shelfId, sagaId, year, page, limit } = req.query;

    // 2. Limpiamos la conversión de datos usando OR (||)
    // Si la conversión a Number falla o no existe, devuelve 'undefined' y el servicio lo ignora.
    const result = await this.booksService.findAll({
      search: search as string | undefined,
      authorId: Number(authorId) || undefined, 
      genreId: Number(genreId) || undefined,
      shelfId: Number(shelfId) || undefined,
      sagaId: Number(sagaId) || undefined,
      year: Number(year) || undefined,
      page: Number(page) || 1,    // Si no envían 'page', asume la página 1
      limit: Number(limit) || 10, // Si no envían 'limit', trae 10 resultados
    });

    res.status(HTTP_STATUS.OK).json(result);
  });

  // GET /books/:id -> Obtiene el detalle de un solo libro
  getById = asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const book = await this.booksService.findById(id);

    res.status(HTTP_STATUS.OK).json(book);
  });

  // POST /books -> Guarda un nuevo libro en la base de datos
  create = asyncHandler(async (req: Request, res: Response) => {
    const book = await this.booksService.create(req.body);

    res.status(HTTP_STATUS.CREATED).json(book); // 201: Creado con éxito
  });

  // PUT /books/:id -> Modifica la información de un libro
  update = asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const book = await this.booksService.update(id, req.body);

    res.status(HTTP_STATUS.OK).json(book);
  });

  // DELETE /books/:id -> Borra un libro
  delete = asyncHandler(async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    await this.booksService.delete(id);

    res.status(HTTP_STATUS.NO_CONTENT).send(); // 204: Éxito, sin contenido que devolver
  });
}