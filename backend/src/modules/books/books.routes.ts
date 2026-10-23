import { Router } from 'express';
import { BooksController } from './books.controller';
import { validate } from '../../shared/middlewares/validation.middleware';
import {
  createBookSchema,
  updateBookSchema,
  bookIdSchema,
  listBooksSchema,
} from './books.validation';

const router = Router();
const controller = new BooksController();

router.get(
  '/',
  validate(listBooksSchema),
  (req, res, next) => controller.list(req, res, next)
);

router.get(
  '/:id',
  validate(bookIdSchema),
  (req, res, next) => controller.getById(req, res, next)
);

router.post(
  '/',
  validate(createBookSchema),
  (req, res, next) => controller.create(req, res, next)
);

router.put(
  '/:id',
  validate(updateBookSchema),
  (req, res, next) => controller.update(req, res, next)
);

router.delete(
  '/:id',
  validate(bookIdSchema),
  (req, res, next) => controller.delete(req, res, next)
);

export default router;