import { Request, Response } from "express";
import { BooksService } from "./books.service";

const booksService = new BooksService();

export const getBooks = async (req: Request, res: Response) => {
  try {
    const filters = {
      genreId: req.query.genreId ? Number(req.query.genreId) : undefined,
      authorId: req.query.authorId ? Number(req.query.authorId) : undefined,
      year: req.query.year ? Number(req.query.year) : undefined,
      page: req.query.page ? Number(req.query.page) : 1,
      limit: req.query.limit ? Number(req.query.limit) : 10,
    };

    const catalog = await booksService.getCatalog(filters);
    res.json(catalog);
  } catch (error: any) {
    res.status(500).json({ error: "Error al obtener el catálogo de libros" });
  }
};

export const getBookById = async (req: Request, res: Response) => {
  try {
    const book = await booksService.getById(Number(req.params.id));
    if (!book) return res.status(404).json({ error: "Libro no encontrado" });
    res.json(book);
  } catch (error) {
    res.status(500).json({ error: "Error al buscar el libro" });
  }
};

export const createBook = async (req: Request, res: Response) => {
  try {
    const book = await booksService.create(req.body);
    res.status(201).json(book);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const updateBook = async (req: Request, res: Response) => {
  try {
    const book = await booksService.update(Number(req.params.id), req.body);
    if (!book) return res.status(404).json({ error: "Libro no encontrado" });
    res.json(book);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteBook = async (req: Request, res: Response) => {
  try {
    const deleted = await booksService.delete(Number(req.params.id));
    if (!deleted) return res.status(404).json({ error: "Libro no encontrado" });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Error interno al eliminar el libro" });
  }
};
