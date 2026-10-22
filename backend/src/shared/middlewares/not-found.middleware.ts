import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/app-error';
import { HttpStatus } from '../constants/http-status';

export const notFoundMiddleware = (req: Request, _res: Response, next: NextFunction): void => {
  next(new AppError(`Ruta no encontrada: ${req.method} ${req.originalUrl}`, HttpStatus.NOT_FOUND));
};