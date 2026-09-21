import type { Request, Response, NextFunction } from "express";

export const authenticateSimuladoMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const userRole = req.headers["x-user-role"] as string;

  if (!userRole) {
    res
      .status(401)
      .json({ message: "No autenticado. Falta la cabecera x-user-role. " });
    return;
  }
  req.user = {
    id: 1,
    email: "usuario@prueba.com",
    role: userRole,
  };
  next();
};
