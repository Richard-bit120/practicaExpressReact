import type { Request, Response, NextFunction } from "express";
import { json } from "node:stream/consumers";

export const errorHandlerMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  console.error("Error capturado por el middleware", err.message || err);

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    message: err.message || "Ha ocurrido un error interno en el servidor.",
  });
};
