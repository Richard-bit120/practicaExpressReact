import type { Request, Response, NextFunction } from "express";

export const authorizeRoleMiddleware = (allowedRole: string) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ message: "Usuario no autenticado." });
      return;
    }
    if (req.user.role !== allowedRole) {
      res
        .status(403)
        .json({
          message: `Acceso denegado. Se requiere el rol '${allowedRole}',pero tu rol es '${req.user.role}'`,
        });
      return;
    }
    next();
  };
};
