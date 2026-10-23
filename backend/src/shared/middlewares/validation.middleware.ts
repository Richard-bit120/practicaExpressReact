import { NextFunction, Request, Response } from "express";
import { AnySchema } from "yup";
import { AppError } from "../errors/app-error";
import { MESSAGES } from "../constants/messages";

export const validate =
  (schema: AnySchema) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.validate(
        { body: req.body, query: req.query, params: req.params },
        { abortEarly: false },
      );
      next();
    } catch (err: any) {
      next(new AppError(err.errors.join(", "), 400));
    }
  };
