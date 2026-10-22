import { Request, Response } from 'express';
import { AuthorsService } from './author.service';
import { HttpStatus } from '../../shared/constants/http-status';

export class AuthorsController {
  private authorsService = new AuthorsService();

  getAll = async (_req: Request, res: Response): Promise<Response> => {
    const authors = await this.authorsService.findAll();
    return res.status(HttpStatus.OK).json({ success: true, data: authors });
  };

  getOne = async (req: Request, res: Response): Promise<Response> => {
    const id = Number(req.params.id);
    const author = await this.authorsService.findOne(id);
    return res.status(HttpStatus.OK).json({ success: true, data: author });
  };

  create = async (req: Request, res: Response): Promise<Response> => {
    const author = await this.authorsService.create(req.body);
    return res.status(HttpStatus.CREATED).json({ success: true, data: author });
  };

  update = async (req: Request, res: Response): Promise<Response> => {
    const id = Number(req.params.id);
    const author = await this.authorsService.update(id, req.body);
    return res.status(HttpStatus.OK).json({ success: true, data: author });
  };

  delete = async (req: Request, res: Response): Promise<Response> => {
    const id = Number(req.params.id);
    await this.authorsService.remove(id);
    return res.status(HttpStatus.NO_CONTENT).send();
  };
}