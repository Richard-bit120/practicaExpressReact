import { Request, Response } from "express";
import { LogsService } from "./logs.service";
import { asyncHandler } from "../../shared/utils/async-handler";
import { HTTP_STATUS } from "../../shared/constants/http-status";

export class LogsController {
  private logsService: LogsService;

  constructor() {
    this.logsService = new LogsService();
  }

  list = asyncHandler(async (req: Request, res: Response) => {
    const { level, event, dateFrom, dateTo, page, limit } = req.query as any;

    const result = await this.logsService.findAll({
      level: level || undefined,
      event: event || undefined,
      dateFrom: dateFrom || undefined,
      dateTo: dateTo || undefined,
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 50,
    });

    res.status(HTTP_STATUS.OK).json(result);
  });

  cleanup = asyncHandler(async (req: Request, res: Response) => {
    const { days } = req.body;
    const daysToKeep = days ? parseInt(days, 10) : 30;
    const deletedCount = await this.logsService.cleanup(daysToKeep);

    res.status(HTTP_STATUS.OK).json({
      message: `Se eliminaron ${deletedCount} registros de logs anteriores a ${daysToKeep} días.`,
      deletedCount,
    });
  });
}
