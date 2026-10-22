// src/app.ts
import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import { errorMiddleware } from "./shared/middlewares/error.middleware";
import { notFoundMiddleware } from "./shared/middlewares/not-found.middleware";
import { logger } from "./shared/logging/logger";

const app: Application = express();

// Middlewares globales
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging de peticiones HTTP
app.use((req: Request, res: Response, next: NextFunction) => {
  logger.info(`Incoming Request: ${req.method} ${req.url}`);
  next();
});

// Rutas (Se irán montando aquí por módulo)
app.get("/health", (req: Request, res: Response) => {
  res
    .status(200)
    .json({ status: "OK", message: "API funcionando correctamente" });
});

// Middlewares de error (Deben ir al final)
app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;
