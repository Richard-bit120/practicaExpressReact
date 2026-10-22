import * as Yup from 'yup';
import { AUTH_MESSAGES } from '../auth.constants';

export const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email(AUTH_MESSAGES.INVALID_EMAIL)
    .required(AUTH_MESSAGES.REQUIRED_EMAIL),
  password: Yup.string()
    .required(AUTH_MESSAGES.REQUIRED_PASSWORD),
});