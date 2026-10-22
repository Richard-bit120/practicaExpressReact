import { Router } from 'express';
import { GenresController } from './genres.controller';
import { authMiddleware } from '../../shared/middlewares/auth.middleware';
import { validateBody } from '../../shared/middlewares/validation.middleware';
import { validateCreateGenre, validateUpdateGenre } from './genres.validation';
import { asyncHandler } from '../../shared/utils/async-handler';

const router = Router();
const controller = new GenresController();

// Rutas públicas (para consulta de catálogo si aplica) o lectura protegida
router.get('/', asyncHandler(controller.getAll));
router.get('/:id', asyncHandler(controller.getOne));

// Rutas administrativas protegidas por JWT
router.post(
  '/',
  authMiddleware,
  validateBody(validateCreateGenre),
  asyncHandler(controller.create)
);

router.put(
  '/:id',
  authMiddleware,
  validateBody(validateUpdateGenre),
  asyncHandler(controller.update)
);

router.delete(
  '/:id',
  authMiddleware,
  asyncHandler(controller.delete)
);

export default router;