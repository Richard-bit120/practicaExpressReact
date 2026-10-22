import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AppDataSource } from '../../config/data-source';
import { Admin } from './admin.entity';
import { ENV } from '../../config/env';
import { AppError } from '../../shared/errors/app-error';
import { HttpStatus } from '../../shared/constants/http-status';
import { Messages } from '../../shared/constants/messages';
import { Logger } from '../../shared/logging/logger';

export class AuthService {
  private adminRepository = AppDataSource.getRepository(Admin);

  async login(email: string, password: string) {
    const admin = await this.adminRepository.findOne({ where: { email } });
    if (!admin) {
      Logger.warn('LOGIN_FAILED', `Attempt with non-existent email: ${email}`);
      throw new AppError(Messages.INVALID_CREDENTIALS, HttpStatus.UNAUTHORIZED);
    }

    const isMatch = await bcrypt.compare(password, admin.passwordHash);
    if (!isMatch) {
      Logger.warn('LOGIN_FAILED', `Invalid password for email: ${email}`);
      throw new AppError(Messages.INVALID_CREDENTIALS, HttpStatus.UNAUTHORIZED);
    }

    const token = jwt.sign({ id: admin.id, email: admin.email }, ENV.JWT_SECRET, {
      expiresIn: ENV.JWT_EXPIRES_IN as any,
    });

    Logger.info('LOGIN_SUCCESS', `Admin logged in successfully: ${email}`);
    return {
      token,
      admin: {
        id: admin.id,
        email: admin.email,
      },
    };
  }
}