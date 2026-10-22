import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { AuthService } from "./auth.service";

const authService = new AuthService();

export class AuthController {
  async login(req: Request, res: Response): Promise<void> {
    // Verificar errores de express-validator
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { username, password } = req.body;

    try {
      const result = await authService.login(username, password);
      res.status(200).json(result);
    } catch (error: any) {
      res
        .status(401)
        .json({ message: error.message || "Error de autenticación" });
    }
  }
}
