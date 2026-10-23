import { Router } from 'express';
import { ShelvesController } from './shelves.controller';
import { validate } from '../../shared/middlewares/validation.middleware';
import {
  createShelfSchema,
  updateShelfSchema,
  shelfIdSchema,
  listShelvesSchema,
} from './shelves.validation';

const router = Router();
const controller = new ShelvesController();

router.get(
  '/',
  validate(listShelvesSchema),
  (req, res, next) => controller.list(req, res, next)
);

router.get(
  '/:id',
  validate(shelfIdSchema),
  (req, res, next) => controller.getById(req, res, next)
);

router.post(
  '/',
  validate(createShelfSchema),
  (req, res, next) => controller.create(req, res, next)
);

router.put(
  '/:id',
  validate(updateShelfSchema),
  (req, res, next) => controller.update(req, res, next)
);

router.delete(
  '/:id',
  validate(shelfIdSchema),
  (req, res, next) => controller.delete(req, res, next)
);

export default router;