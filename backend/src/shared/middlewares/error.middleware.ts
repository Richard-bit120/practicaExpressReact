import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/app-error";
import { logger } from "../logging/logger";

export const errorMiddleware = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err instanceof AppError) {
    logger.warn(
      `[Operational Error] ${req.method} ${req.path} - ${err.message}`,
    );
    return res.status(err.statusCode).json({
      status: "error",
      message: err.message,
    });
  }

  // Errores inesperados (500)
  console.error("🚨 ERROR REAL QUE CAUSA EL 500:", err);
  logger.error(
    `[Unexpected Error] ${req.method} ${req.path} - ${err.message}`,
    { stack: err.stack },
  );

  return res.status(500).json({
    status: "error",
    message: "Error interno del servidor. Por favor, inténtelo más tarde.",
  });
};
