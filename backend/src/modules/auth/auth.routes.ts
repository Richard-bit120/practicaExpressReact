import { Router } from 'express';
import { AuthController } from './auth.controller';
import { validateBody } from '../../shared/middlewares/validation.middleware';
import { validateLogin } from './auth.validation';
import { asyncHandler } from '../../shared/utils/async-handler';

const router = Router();
const controller = new AuthController();

router.post('/login', validateBody(validateLogin), asyncHandler(controller.login));

export default router;