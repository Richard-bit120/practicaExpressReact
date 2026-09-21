import type { Request, Response, NextFunction } from "express";

export const validateBodyMiddleware = (requiredFields: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const missingFields: string[] = [];

    for (const field of requiredFields) {
      if (
        !req.body ||
        req.body[field] === undefined ||
        req.body[field] === null ||
        req.body[field] === ""
      ) {
        missingFields.push(field);
      }
    }
    if (missingFields.length > 0) {
      res.status(400).json({
        message: `Error de validacion. Faltan los siguientes campos obligatorios: ${missingFields.join(", ")}`,
      });
      return;
    }
    next();
  };
};
