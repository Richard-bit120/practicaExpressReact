import { Router } from "express";
import { AuthController } from "./auth.controller";
import { loginValidation } from "./auth.validation";

const router = Router();
const authController = new AuthController();

// POST /api/auth/login
router.post(
  "/login",
  loginValidation,
  authController.login.bind(authController),
);

export default router;
