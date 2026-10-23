import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../../config/env";
import { AppError } from "../errors/app-error";
import { MESSAGES } from "../constants/messages";

export interface JwtPayload {
  id: number;
  username: string;
}

declare global {
  namespace Express {
    interface Request {
      admin?: JwtPayload;
    }
  }
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new AppError(MESSAGES.AUTH.TOKEN_NOT_PROVIDED, 401));
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
    req.admin = decoded;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return next(new AppError(MESSAGES.AUTH.TOKEN_EXPIRED, 401));
    }
    return next(new AppError(MESSAGES.AUTH.TOKEN_INVALID, 401));
  }
};
