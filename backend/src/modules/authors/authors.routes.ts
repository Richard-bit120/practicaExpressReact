import { Router } from 'express';
import { AuthorsController } from './authors.controller';
import { validate } from '../../shared/middlewares/validation.middleware';
import {
  createAuthorSchema,
  updateAuthorSchema,
  getAuthorByIdSchema,
  deleteAuthorSchema,
  listAuthorsSchema,
} from './authors.validation';

const router = Router();
const controller = new AuthorsController();

router.get('/', validate(listAuthorsSchema), (req, res, next) => controller.list(req, res, next));
router.get('/:id', validate(getAuthorByIdSchema), (req, res, next) => controller.getById(req, res, next));
router.post('/', validate(createAuthorSchema), (req, res, next) => controller.create(req, res, next));
router.put('/:id', validate(updateAuthorSchema), (req, res, next) => controller.update(req, res, next));
router.delete('/:id', validate(deleteAuthorSchema), (req, res, next) => controller.delete(req, res, next));

export default router;