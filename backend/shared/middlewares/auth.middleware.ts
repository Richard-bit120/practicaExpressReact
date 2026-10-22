import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Extendemos la interfaz de Request de Express para que acepte la propiedad 'user'
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const authenticateJWT = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    const secret = process.env.JWT_SECRET || "default_secret_key";

    jwt.verify(token, secret, (err, decodedUser) => {
      if (err) {
        res.status(403).json({ message: "Token inválido o expirado" });
        return;
      }
      // Adjuntar el payload del usuario al objeto request
      req.user = decodedUser;
      next();
    });
  } else {
    res
      .status(401)
      .json({
        message: "Se requiere un token de autenticación (Bearer Token)",
      });
  }
};
