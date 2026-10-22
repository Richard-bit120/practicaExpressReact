import { body } from "express-validator";

export const loginValidation = [
  body("username")
    .notEmpty()
    .withMessage("El nombre de usuario es requerido.")
    .isString()
    .withMessage("El nombre de usuario debe ser texto."),
  body("password")
    .notEmpty()
    .withMessage("La contraseña es requerida.")
    .isString()
    .withMessage("La contraseña debe ser texto."),
];
