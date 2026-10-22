import { Request, Response, NextFunction } from "express";
import { logsService } from "../../modules/logs/logs.service";
import { LogLevel, LogEvent } from "../../modules/logs/logs.entity";

export const requestLoggerMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    const { method, originalUrl, ip } = req;
    const status = res.statusCode;

    // Filtramos información sensible del body (ej: passwords) si quisiéramos guardarlo
    // En este caso, solo guardamos metadata de la petición segura.
    const metadata = {
      method,
      path: originalUrl,
      status,
      durationMs: duration,
      ip,
    };

    logsService.createLog({
      level: LogLevel.INFO,
      event: LogEvent.HTTP_REQUEST,
      message: `HTTP ${method} ${originalUrl} - ${status} (${duration}ms)`,
      metadata,
    });
  });

  next();
};
