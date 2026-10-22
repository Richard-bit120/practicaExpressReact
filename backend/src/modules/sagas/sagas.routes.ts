import { Router } from 'express';
import { SagasController } from './sagas.controller';
import { authMiddleware } from '../../shared/middlewares/auth.middleware';
import { validateBody } from '../../shared/middlewares/validation.middleware';
import { validateCreateSaga, validateUpdateSaga } from './sagas.validation';
import { asyncHandler } from '../../shared/utils/async-handler';

const router = Router();
const controller = new SagasController();

router.get('/', asyncHandler(controller.getAll));
router.get('/:id', asyncHandler(controller.getOne));

router.post(
  '/',
  authMiddleware,
  validateBody(validateCreateSaga),
  asyncHandler(controller.create)
);

router.put(
  '/:id',
  authMiddleware,
  validateBody(validateUpdateSaga),
  asyncHandler(controller.update)
);

router.delete(
  '/:id',
  authMiddleware,
  asyncHandler(controller.delete)
);

export default router;