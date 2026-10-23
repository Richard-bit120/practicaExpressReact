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

router.get('/', validate(listAuthorsSchema), controller.list);
router.get('/:id', validate(getAuthorByIdSchema), controller.getById);
router.post('/', validate(createAuthorSchema), controller.create);
router.put('/:id', validate(updateAuthorSchema), controller.update);
router.delete('/:id', validate(deleteAuthorSchema), controller.delete);

export default router;