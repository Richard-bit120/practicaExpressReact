import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { asyncHandler } from "../../shared/utils/async-handler";
import { HTTP_STATUS } from "../../shared/constants/http-status";

export class AuthController {
  // Instanciamos el servicio directamente para mantener la consistencia y eliminar el constructor
  private authService = new AuthService();

  // POST /auth/login -> Autentica al usuario y genera su token de acceso
  login = asyncHandler(async (req: Request, res: Response) => {
    // 1. Extraemos las credenciales enviadas de forma segura en el body de la petición
    const { username, password } = req.body;

    // 2. El servicio valida la contraseña y genera la respuesta (generalmente con el JWT)
    const result = await this.authService.login(username, password);

    // 3. Devolvemos el resultado con estado 200 (OK)
    res.status(HTTP_STATUS.OK).json(result);
  });
}