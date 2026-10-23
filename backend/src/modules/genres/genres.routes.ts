import { Router } from 'express';
import { GenresController } from './genres.controller';
import { validate } from '../../shared/middlewares/validation.middleware';
import {
  createGenreSchema,
  updateGenreSchema,
  genreIdSchema,
  listGenresSchema,
} from './genres.validation';

const router = Router();
const controller = new GenresController();

router.get(
  '/',
  validate(listGenresSchema),
  (req, res, next) => controller.list(req, res, next)
);

router.get(
  '/:id',
  validate(genreIdSchema),
  (req, res, next) => controller.getById(req, res, next)
);

router.post(
  '/',
  validate(createGenreSchema),
  (req, res, next) => controller.create(req, res, next)
);

router.put(
  '/:id',
  validate(updateGenreSchema),
  (req, res, next) => controller.update(req, res, next)
);

router.delete(
  '/:id',
  validate(genreIdSchema),
  (req, res, next) => controller.delete(req, res, next)
);

export default router;