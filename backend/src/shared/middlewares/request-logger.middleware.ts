import { Request, Response, NextFunction } from "express";
import { LogsService } from "../../modules/logs/logs.service";
import { logger } from "../logging/logger";

const logsService = new LogsService();

export const requestLoggerMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const start = Date.now();

  // Capturar el evento de finalización de la respuesta
  res.on("finish", () => {
    const duration = Date.now() - start;
    const logData = {
      level:
        res.statusCode >= 500
          ? "ERROR"
          : res.statusCode >= 400
            ? "WARN"
            : "INFO",
      event: "HTTP_REQUEST",
      message: `${req.method} ${req.originalUrl} - ${res.statusCode} (${duration}ms)`,
      method: req.method,
      path: req.originalUrl,
      statusCode: res.statusCode,
      responseTime: duration,
    };

    // Log en consola/archivo
    if (logData.level === "ERROR") {
      logger.error(logData.message);
    } else if (logData.level === "WARN") {
      logger.warn(logData.message);
    } else {
      logger.info(logData.message);
    }

    // Log en base de datos (asíncrono, no bloquea la respuesta)
    logsService.write(logData).catch((err) => {
      console.error("Error writing HTTP log to DB:", err.message);
    });
  });

  next();
};
