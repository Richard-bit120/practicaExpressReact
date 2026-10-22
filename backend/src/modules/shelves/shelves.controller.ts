import { Request, Response } from 'express';
import { ShelvesService } from './shelves.service';
import { HttpStatus } from '../../shared/constants/http-status';

export class ShelvesController {
  private shelvesService = new ShelvesService();

  getAll = async (_req: Request, res: Response): Promise<Response> => {
    const shelves = await this.shelvesService.findAll();
    return res.status(HttpStatus.OK).json({ success: true, data: shelves });
  };

  getOne = async (req: Request, res: Response): Promise<Response> => {
    const id = Number(req.params.id);
    const shelf = await this.shelvesService.findOne(id);
    return res.status(HttpStatus.OK).json({ success: true, data: shelf });
  };

  create = async (req: Request, res: Response): Promise<Response> => {
    const shelf = await this.shelvesService.create(req.body);
    return res.status(HttpStatus.CREATED).json({ success: true, data: shelf });
  };

  update = async (req: Request, res: Response): Promise<Response> => {
    const id = Number(req.params.id);
    const shelf = await this.shelvesService.update(id, req.body);
    return res.status(HttpStatus.OK).json({ success: true, data: shelf });
  };

  delete = async (req: Request, res: Response): Promise<Response> => {
    const id = Number(req.params.id);
    await this.shelvesService.remove(id);
    return res.status(HttpStatus.NO_CONTENT).send();
  };
}