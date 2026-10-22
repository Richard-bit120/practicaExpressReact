import { Request, Response, NextFunction } from "express";
import { AuthorService } from "../services/AuthorService";

export class AuthorController {
  private authorService = new AuthorService();

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const author = await this.authorService.create(req.body);
      res.status(201).json(author);
    } catch (error) {
      next(error);
    }
  };

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authors = await this.authorService.findAll();
      res.status(200).json(authors);
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const author = await this.authorService.findById(req.params.id);
      res.status(200).json(author);
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const author = await this.authorService.update(req.params.id, req.body);
      res.status(200).json(author);
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.authorService.delete(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}
