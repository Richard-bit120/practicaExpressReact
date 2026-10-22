import { Router } from 'express';
import { ShelvesController } from './shelves.controller';
import { authMiddleware } from '../../shared/middlewares/auth.middleware';
import { validateBody } from '../../shared/middlewares/validation.middleware';
import { validateCreateShelf, validateUpdateShelf } from './shelves.validation';
import { asyncHandler } from '../../shared/utils/async-handler';

const router = Router();
const controller = new ShelvesController();

router.get('/', asyncHandler(controller.getAll));
router.get('/:id', asyncHandler(controller.getOne));

router.post(
  '/',
  authMiddleware,
  validateBody(validateCreateShelf),
  asyncHandler(controller.create)
);

router.put(
  '/:id',
  authMiddleware,
  validateBody(validateUpdateShelf),
  asyncHandler(controller.update)
);

router.delete(
  '/:id',
  authMiddleware,
  asyncHandler(controller.delete)
);

export default router;