import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { env } from './config/env';
import { errorMiddleware } from './shared/middlewares/error.middleware';
import { notFoundMiddleware } from './shared/middlewares/not-found.middleware';
import { logger } from './shared/logging/logger';
import { authMiddleware } from './shared/middlewares/auth.middleware';

// Rutas
import authRoutes from './modules/auth/auth.routes';
import booksRoutes from './modules/books/books.routes';
import authorsRoutes from './modules/authors/authors.routes';
import genresRoutes from './modules/genres/genres.routes';
import sagasRoutes from './modules/sagas/sagas.routes';
import shelvesRoutes from './modules/shelves/shelves.routes';

const app = express();

// Middlewares globales
app.use(cors({ origin: env.FRONTEND_URL, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging HTTP
app.use(morgan('combined', {
  stream: { write: (message: string) => logger.info(message.trim()) }
}));

// Healthcheck
app.get('/health', (req, res) => res.status(200).json({ status: 'OK' }));

// Rutas públicas
app.use('/api/auth', authRoutes);

// Rutas protegidas con JWT
app.use('/api/books', authMiddleware, booksRoutes);
app.use('/api/authors', authMiddleware, authorsRoutes);
app.use('/api/genres', authMiddleware, genresRoutes);
app.use('/api/sagas', authMiddleware, sagasRoutes);
app.use('/api/shelves', authMiddleware, shelvesRoutes);

// Middlewares de error (siempre al final)
app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;