import { Router } from 'express';
import { AuthorsController } from './author.controller';
import { authMiddleware } from '../../shared/middlewares/auth.middleware';
import { validateBody } from '../../shared/middlewares/validation.middleware';
import { validateCreateAuthor, validateUpdateAuthor } from './author.validation';
import { asyncHandler } from '../../shared/utils/async-handler';

const router = Router();
const controller = new AuthorsController();

router.get('/', asyncHandler(controller.getAll));
router.get('/:id', asyncHandler(controller.getOne));

router.post(
  '/',
  authMiddleware,
  validateBody(validateCreateAuthor),
  asyncHandler(controller.create)
);

router.put(
  '/:id',
  authMiddleware,
  validateBody(validateUpdateAuthor),
  asyncHandler(controller.update)
);

router.delete(
  '/:id',
  authMiddleware,
  asyncHandler(controller.delete)
);

export default router;