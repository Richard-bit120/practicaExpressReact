// src/shared/middlewares/error.middleware.ts
import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/app-error";
import { logger } from "../logging/logger";

export const errorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      status: "error",
      message: err.message,
    });
    return;
  }

  // Errores no operacionales (bugs, base de datos caída, etc.)
  logger.error(`[UNHANDLED ERROR] ${err.name}: ${err.message}`, {
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  res.status(500).json({
    status: "error",
    message: "Error interno del servidor",
  });
};
