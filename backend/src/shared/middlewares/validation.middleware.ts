import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/app-error';
import { HttpStatus } from '../constants/http-status';

export const validateBody = (validator: (data: any) => string | null) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const errorMsg = validator(req.body);
    if (errorMsg) {
      throw new AppError(errorMsg, HttpStatus.BAD_REQUEST);
    }
    next();
  };
};

export const validateQuery = (validator: (data: any) => string | null) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const errorMsg = validator(req.query);
    if (errorMsg) {
      throw new AppError(errorMsg, HttpStatus.BAD_REQUEST);
    }
    next();
  };
};