import { Router } from 'express';
import { SagasController } from './sagas.controller';
import { validate } from '../../shared/middlewares/validation.middleware';
import {
  createSagaSchema,
  updateSagaSchema,
  sagaIdSchema,
  listSagasSchema,
} from './sagas.validation';

const router = Router();
const controller = new SagasController();

router.get(
  '/',
  validate(listSagasSchema),
  (req, res, next) => controller.list(req, res, next)
);

router.get(
  '/:id',
  validate(sagaIdSchema),
  (req, res, next) => controller.getById(req, res, next)
);

router.post(
  '/',
  validate(createSagaSchema),
  (req, res, next) => controller.create(req, res, next)
);

router.put(
  '/:id',
  validate(updateSagaSchema),
  (req, res, next) => controller.update(req, res, next)
);

router.delete(
  '/:id',
  validate(sagaIdSchema),
  (req, res, next) => controller.delete(req, res, next)
);

export default router;