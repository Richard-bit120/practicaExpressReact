import { Request, Response } from 'express';
import { GenresService } from './genres.service';
import { HttpStatus } from '../../shared/constants/http-status';

export class GenresController {
  private genresService = new GenresService();

  getAll = async (_req: Request, res: Response): Promise<Response> => {
    const genres = await this.genresService.findAll();
    return res.status(HttpStatus.OK).json({ success: true, data: genres });
  };

  getOne = async (req: Request, res: Response): Promise<Response> => {
    const id = Number(req.params.id);
    const genre = await this.genresService.findOne(id);
    return res.status(HttpStatus.OK).json({ success: true, data: genre });
  };

  create = async (req: Request, res: Response): Promise<Response> => {
    const genre = await this.genresService.create(req.body);
    return res.status(HttpStatus.CREATED).json({ success: true, data: genre });
  };

  update = async (req: Request, res: Response): Promise<Response> => {
    const id = Number(req.params.id);
    const genre = await this.genresService.update(id, req.body);
    return res.status(HttpStatus.OK).json({ success: true, data: genre });
  };

  delete = async (req: Request, res: Response): Promise<Response> => {
    const id = Number(req.params.id);
    await this.genresService.remove(id);
    return res.status(HttpStatus.NO_CONTENT).send();
  };
}