import { Request, Response } from "express";
import { logsService } from "./logs.service";
import { LogLevel } from "./logs.entity";

export class LogsController {
  async getLogs(req: Request, res: Response) {
    try {
      const { level, startDate, endDate } = req.query;

      const logs = await logsService.getLogs({
        level: level as LogLevel,
        startDate: startDate as string,
        endDate: endDate as string,
      });

      res.status(200).json(logs);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener los logs", error });
    }
  }
}

export const logsController = new LogsController();
