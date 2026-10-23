import express from "express";
import cors from "cors";
import morgan from "morgan";
import { env } from "./config/env";
import { errorMiddleware } from "./shared/middlewares/error.middleware";
import { notFoundMiddleware } from "./shared/middlewares/not-found.middleware";
import { logger } from "./shared/logging/logger";
import authRoutes from "./modules/auth/auth.routes";

const app = express();

// Middlewares globales
app.use(cors({ origin: env.FRONTEND_URL, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Morgan para logging HTTP (integrado con nuestro logger)
app.use(
  morgan("combined", {
    stream: { write: (message: string) => logger.info(message.trim()) },
  }),
);

// Healthcheck
app.get("/health", (req, res) => res.status(200).json({ status: "OK" }));

// Rutas de Autenticación
app.use("/api/auth", authRoutes);

// Aquí montaremos las rutas protegidas en la Etapa 4
// app.use('/api/books', authMiddleware, booksRoutes);

// Middlewares de error
app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;
