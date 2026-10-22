import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ENV } from '../../config/env';
import { AppError } from '../errors/app-error';
import { HttpStatus } from '../constants/http-status';
import { Messages } from '../constants/messages';

export interface AuthRequest extends Request {
  admin?: { id: number; email: string };
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new AppError(Messages.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
  }

  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, ENV.JWT_SECRET) as { id: number; email: string };
    req.admin = payload;
    next();
  } catch {
    throw new AppError(Messages.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
  }
};