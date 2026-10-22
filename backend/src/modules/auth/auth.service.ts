import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AppDataSource } from "../../config/database";
import { User } from "./auth.entity";
import { logsService } from "../logs/logs.service";
import { LogLevel, LogEvent } from "../logs/logs.entity";

export class AuthService {
  private userRepository = AppDataSource.getRepository(User);

  async login(username: string, password: string) {
    // 1. Buscar usuario
    const user = await this.userRepository.findOne({ where: { username } });

    if (!user) {
      // Log de intento fallido (usuario no existe)
      await logsService.createLog({
        level: LogLevel.WARN,
        event: LogEvent.AUTH,
        message: "Intento de login fallido",
        metadata: { username }, // Reemplazado inputEmail por username
      });

      throw new Error("Credenciales inválidas");
    }

    // 2. Comparar contraseñas
    const isMatch = await bcrypt.compare(password, user.passwordHash);

    if (!isMatch) {
      // Log de intento fallido (contraseña incorrecta)
      await logsService.createLog({
        level: LogLevel.WARN,
        event: LogEvent.AUTH,
        message: "Intento de login fallido",
        metadata: { username },
      });

      throw new Error("Credenciales inválidas");
    }

    // 3. Generar JWT (Expiración configurable mediante variable de entorno)
    const payload = { id: user.id, username: user.username };
    const secret = process.env.JWT_SECRET || "default_secret_key";
    const expiresIn = process.env.JWT_EXPIRES_IN || "2h";
    const token = jwt.sign(payload, secret, { expiresIn });

    // Log de éxito (Adaptado a tu entidad de usuario)
    await logsService.createLog({
      level: LogLevel.INFO,
      event: LogEvent.AUTH,
      message: "Administrador inició sesión",
      metadata: { userId: user.id, username: user.username },
    });

    // 4. Retornar datos (excluyendo el hash)
    return {
      user: payload,
      token,
    };
  }
}
