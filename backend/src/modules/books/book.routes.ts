import { Router } from 'express';
import { BooksController } from './book.controller';
import { authMiddleware } from '../../shared/middlewares/auth.middleware';
import { validateBody } from '../../shared/middlewares/validation.middleware';
import { validateCreateBook, validateUpdateBook } from './book.validation';
import { asyncHandler } from '../../shared/utils/async-handler';

const router = Router();
const controller = new BooksController();

// Rutas de consulta pública/general del catálogo con filtros
router.get('/', asyncHandler(controller.getAll));
router.get('/:id', asyncHandler(controller.getOne));

// Rutas administrativas protegidas por JWT
router.post(
  '/',
  authMiddleware,
  validateBody(validateCreateBook),
  asyncHandler(controller.create)
);

router.put(
  '/:id',
  authMiddleware,
  validateBody(validateUpdateBook),
  asyncHandler(controller.update)
);

router.delete(
  '/:id',
  authMiddleware,
  asyncHandler(controller.delete)
);

export default router;