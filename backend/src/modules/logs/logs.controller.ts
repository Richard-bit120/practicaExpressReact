import { Request, Response } from "express";
import { LogsService } from "./logs.service";
import { asyncHandler } from "../../shared/utils/async-handler";
import { HTTP_STATUS } from "../../shared/constants/http-status";

export class LogsController {
  // Instanciamos el servicio directamente en la propiedad para eliminar el constructor
  private logsService = new LogsService();

  // GET /logs -> Consulta y filtra los registros del sistema
  list = asyncHandler(async (req: Request, res: Response) => {
    const { level, event, dateFrom, dateTo, page, limit } = req.query;

    const result = await this.logsService.findAll({
      level: (level as string) || undefined,
      event: (event as string) || undefined,
      dateFrom: (dateFrom as string) || undefined,
      dateTo: (dateTo as string) || undefined,
      page: Number(page) || 1,     // Página por defecto: 1
      limit: Number(limit) || 50,  // Por defecto trae 50 registros
    });

    res.status(HTTP_STATUS.OK).json(result);
  });

  // POST /logs/cleanup -> Mantenimiento: elimina registros antiguos
  cleanup = asyncHandler(async (req: Request, res: Response) => {
    // Si no especifican 'days' en el body, se conservan 30 días por defecto
    const daysToKeep = Number(req.body.days) || 30;

    const deletedCount = await this.logsService.cleanup(daysToKeep);

    res.status(HTTP_STATUS.OK).json({
      message: `Se eliminaron ${deletedCount} registros de logs anteriores a ${daysToKeep} días.`,
      deletedCount,
    });
  });
}