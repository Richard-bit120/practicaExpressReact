import express from 'express';
import cors from 'cors';
import { ENV } from './config/env';
import { requestLoggerMiddleware } from './shared/middlewares/request-logger.middleware';
import { errorMiddleware } from './shared/middlewares/error.middleware';
import { notFoundMiddleware } from './shared/middlewares/not-found.middleware';

import authRoutes from './modules/auth/auth.routes';
import booksRoutes from './modules/books/book.routes';
import authorsRoutes from './modules/authors/author.routes';
import genresRoutes from './modules/genres/genres.routes';
import sagasRoutes from './modules/sagas/sagas.routes';
import shelvesRoutes from './modules/shelves/shelves.routes';
import logsRoutes from './modules/logs/logs.routes';

const app = express();

app.use(cors({ origin: ENV.CORS_ORIGIN }));
app.use(express.json());
app.use(requestLoggerMiddleware);

// Rutas de API Modular
app.use('/api/auth', authRoutes);
app.use('/api/books', booksRoutes);
app.use('/api/authors', authorsRoutes);
app.use('/api/genres', genresRoutes);
app.use('/api/sagas', sagasRoutes);
app.use('/api/shelves', shelvesRoutes);
app.use('/api/logs', logsRoutes);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;