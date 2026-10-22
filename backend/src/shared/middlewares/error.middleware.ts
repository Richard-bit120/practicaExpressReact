import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/app-error';
import { HttpStatus } from '../constants/http-status';
import { Messages } from '../constants/messages';
import { Logger } from '../logging/logger';

export const errorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof AppError) {
    Logger.warn('APP_ERROR', `${err.statusCode} - ${err.message} - Route: ${req.method} ${req.originalUrl}`);
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  Logger.error('INTERNAL_ERROR', `${err.stack || err.message} - Route: ${req.method} ${req.originalUrl}`);

  return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: Messages.INTERNAL_ERROR,
    ...(process.env.NODE_ENV === 'development' && { error: err.message }),
  });
};