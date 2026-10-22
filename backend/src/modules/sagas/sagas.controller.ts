import { Request, Response } from 'express';
import { SagasService } from './sagas.service';
import { HttpStatus } from '../../shared/constants/http-status';

export class SagasController {
  private sagasService = new SagasService();

  getAll = async (_req: Request, res: Response): Promise<Response> => {
    const sagas = await this.sagasService.findAll();
    return res.status(HttpStatus.OK).json({ success: true, data: sagas });
  };

  getOne = async (req: Request, res: Response): Promise<Response> => {
    const id = Number(req.params.id);
    const saga = await this.sagasService.findOne(id);
    return res.status(HttpStatus.OK).json({ success: true, data: saga });
  };

  create = async (req: Request, res: Response): Promise<Response> => {
    const saga = await this.sagasService.create(req.body);
    return res.status(HttpStatus.CREATED).json({ success: true, data: saga });
  };

  update = async (req: Request, res: Response): Promise<Response> => {
    const id = Number(req.params.id);
    const saga = await this.sagasService.update(id, req.body);
    return res.status(HttpStatus.OK).json({ success: true, data: saga });
  };

  delete = async (req: Request, res: Response): Promise<Response> => {
    const id = Number(req.params.id);
    await this.sagasService.remove(id);
    return res.status(HttpStatus.NO_CONTENT).send();
  };
}