import { Repository } from "typeorm";
import { AppDataSource } from "../../config/data-source";
import { Admin } from "./admin.entity";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { env } from "../../config/env";
import { AppError } from "../../shared/errors/app-error";
import { logger } from "../../shared/logging/logger";
import { MESSAGES } from "../../shared/constants/messages";

export class AuthService {
  private adminRepository: Repository<Admin>;

  constructor() {
    this.adminRepository = AppDataSource.getRepository(Admin);
  }

  public async login(username: string, password: string) {
    // Necesitamos incluir el password explícitamente ya que tiene select: false
    const admin = await this.adminRepository
      .createQueryBuilder("admin")
      .addSelect("admin.password")
      .where("admin.username = :username", { username })
      .getOne();

    if (!admin) {
      logger.warn(`Intento de login fallido para usuario: ${username}`);
      throw new AppError(MESSAGES.AUTH.INVALID_CREDENTIALS, 401);
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);

    if (!isPasswordValid) {
      logger.warn(`Contraseña incorrecta para usuario: ${username}`);
      throw new AppError(MESSAGES.AUTH.INVALID_CREDENTIALS, 401);
    }

    const token = jwt.sign(
      { id: admin.id, username: admin.username },
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRES_IN as any },
    );

    logger.info(`Login exitoso para usuario: ${username}`);

    return {
      token,
      admin: {
        id: admin.id,
        username: admin.username,
      },
    };
  }
}
