import { Request, Response } from 'express';
import { LogsService } from './logs.service';
import { HttpStatus } from '../../shared/constants/http-status';
import { LogLevel } from './logs.types';

export class LogsController {
  private logsService = new LogsService();

  getAll = async (req: Request, res: Response): Promise<Response> => {
    const level = req.query.level as LogLevel | undefined;
    const startDate = req.query.startDate as string | undefined;
    const endDate = req.query.endDate as string | undefined;
    const limit = req.query.limit ? Number(req.query.limit) : undefined;

    const logs = await this.logsService.findAll({ level, startDate, endDate, limit });
    return res.status(HttpStatus.OK).json({ success: true, data: logs });
  };
}