import { NextFunction, Request, Response } from "express";
import { AnySchema, ValidationError } from "yup";
import { AppError } from "../errors/app-error";
import { MESSAGES } from "../constants/messages";

export const validate =
  (schema: AnySchema) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // 1. Asignamos el resultado verificado y casteado por Yup
      const validated = await schema.validate(
        { body: req.body, query: req.query, params: req.params },
        { abortEarly: false, stripUnknown: true }
      );

      // 2. Reemplazamos req con los datos parseados (ej. '2' -> 2)
      req.body = validated.body ?? req.body;
      req.query = validated.query ?? req.query;
      req.params = validated.params ?? req.params;

      next();
    } catch (err: any) {
      // 3. Capturamos únicamente los errores de validación de Yup con estado 400
      if (err instanceof ValidationError) {
        return next(new AppError(err.errors.join(", "), 400));
      }
      
      // Si el error no es de Yup, lo pasamos al middleware global para debuggear
      next(err);
    }
  };