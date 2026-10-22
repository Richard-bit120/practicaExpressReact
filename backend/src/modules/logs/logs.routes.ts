import { Router } from 'express';
import { LogsController } from './logs.controller';
import { authMiddleware } from '../../shared/middlewares/auth.middleware';
import { asyncHandler } from '../../shared/utils/async-handler';

const router = Router();
const controller = new LogsController();

// Ruta protegida únicamente para el administrador autenticado
router.get('/', authMiddleware, asyncHandler(controller.getAll));

export default router;