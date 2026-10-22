import { Request, Response, NextFunction } from "express";
import { GenreService } from "../services/GenreService";

export class GenreController {
  private genreService = new GenreService();

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const genre = await this.genreService.create(req.body);
      res.status(201).json(genre);
    } catch (error) {
      next(error);
    }
  };

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const genres = await this.genreService.findAll();
      res.status(200).json(genres);
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const genre = await this.genreService.findById(req.params.id);
      res.status(200).json(genre);
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const genre = await this.genreService.update(req.params.id, req.body);
      res.status(200).json(genre);
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.genreService.delete(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}
