import express from "express";
import cors from "cors";
import { env } from "./config/env";
import { errorMiddleware } from "./shared/middlewares/error.middleware";
import { notFoundMiddleware } from "./shared/middlewares/not-found.middleware";
import { requestLoggerMiddleware } from "./shared/middlewares/request-logger.middleware";
import { authMiddleware } from "./shared/middlewares/auth.middleware";
import dashboardRoutes from "../../backend/src/modules/dashboard/dashboard.routes";

// Rutas
import authRoutes from "./modules/auth/auth.routes";
import booksRoutes from "./modules/books/books.routes";
import authorsRoutes from "./modules/authors/authors.routes";
import genresRoutes from "./modules/genres/genres.routes";
import sagasRoutes from "./modules/sagas/sagas.routes";
import shelvesRoutes from "./modules/shelves/shelves.routes";
import logsRoutes from "./modules/logs/logs.routes";

const app = express();

// Middlewares globales
app.use(cors({ origin: env.FRONTEND_URL, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging HTTP estructurado y persistente
app.use(requestLoggerMiddleware);

// Healthcheck
app.get("/health", (req, res) => res.status(200).json({ status: "OK" }));

// Rutas públicas
app.use("/api/auth", authRoutes);

// Rutas protegidas con JWT
app.use("/api/books", authMiddleware, booksRoutes);
app.use("/api/authors", authMiddleware, authorsRoutes);
app.use("/api/genres", authMiddleware, genresRoutes);
app.use("/api/sagas", authMiddleware, sagasRoutes);
app.use("/api/shelves", authMiddleware, shelvesRoutes);
app.use("/api/logs", authMiddleware, logsRoutes);
app.use("/api/dashboard",authMiddleware, dashboardRoutes);

// Middlewares de error (siempre al final)
app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;
