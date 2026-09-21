import type { Request, Response, NextFunction } from "express";

export const requestLoggerMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const metodo = req.method;
  const ruta = req.path;
  const timestamp = new Date().toISOString();

  console.log(`[${timestamp}]  ${metodo} a la ruta ${ruta}`);

  next();
};
