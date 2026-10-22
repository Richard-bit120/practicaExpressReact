// src/shared/middlewares/not-found.middleware.ts
import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/app-error";

export const notFoundMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  next(new AppError(`Ruta no encontrada - ${req.originalUrl}`, 404));
};
