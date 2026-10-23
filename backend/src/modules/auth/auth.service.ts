import { Repository } from "typeorm";
import { AppDataSource } from "../../config/data-source";
import { Admin } from "./admin.entity";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { env } from "../../config/env";
import { AppError } from "../../shared/errors/app-error";
import { logger } from "../../shared/logging/logger";
import { MESSAGES } from "../../shared/constants/messages";
import { LogsService } from "../logs/logs.service";

export class AuthService {
  // Pattern Lazy: Getter dinámico para evitar RepositoryNotFoundError
  private get adminRepository(): Repository<Admin> {
    return AppDataSource.getRepository(Admin);
  }

  // Pattern Lazy: Getter perezoso para el servicio de logs
  private get logsService(): LogsService {
    return new LogsService();
  }

  public async login(username: string, password: string) {
    // Incluimos la contraseña explícitamente ya que la entidad tiene select: false
    const admin = await this.adminRepository
      .createQueryBuilder("admin")
      .addSelect("admin.password")
      .where("admin.username = :username", { username })
      .getOne();

    if (!admin) {
      logger.warn(`Intento de login fallido para usuario: ${username}`);

      this.logsService
        .write({
          level: "WARN",
          event: "LOGIN_FAILED",
          message: `Intento de login fallido para usuario: ${username}`,
        })
        .catch(() => {});

      throw new AppError(MESSAGES.AUTH.INVALID_CREDENTIALS, 401);
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);

    if (!isPasswordValid) {
      logger.warn(`Contraseña incorrecta para usuario: ${username}`);

      this.logsService
        .write({
          level: "WARN",
          event: "LOGIN_FAILED",
          message: `Contraseña incorrecta para usuario: ${username}`,
        })
        .catch(() => {});

      throw new AppError(MESSAGES.AUTH.INVALID_CREDENTIALS, 401);
    }

    const token = jwt.sign(
      { id: admin.id, username: admin.username },
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRES_IN as any },
    );

    logger.info(`Login exitoso para usuario: ${username}`);

    this.logsService
      .write({
        level: "INFO",
        event: "LOGIN_SUCCESS",
        message: `Login exitoso para usuario: ${username}`,
      })
      .catch(() => {});

    return {
      token,
      admin: {
        id: admin.id,
        username: admin.username,
      },
    };
  }
}
