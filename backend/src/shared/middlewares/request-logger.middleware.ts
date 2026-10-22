import { Request, Response, NextFunction } from 'express';
import { Logger } from '../logging/logger';

export const requestLoggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    const { method, originalUrl } = req;
    const { statusCode } = res;
    Logger.info('HTTP_REQUEST', `${method} ${originalUrl} -> Status: ${statusCode} (${duration}ms)`);
  });
  next();
};