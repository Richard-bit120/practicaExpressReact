import { Response } from 'express';
import { AuthRequest } from '../../shared/middlewares/auth.middleware';
import { AuthService } from './auth.service';
import { HttpStatus } from '../../shared/constants/http-status';

export class AuthController {
  private authService = new AuthService();

  login = async (req: AuthRequest, res: Response) => {
    const { email, password } = req.body;
    const result = await this.authService.login(email, password);
    return res.status(HttpStatus.OK).json({ success: true, ...result });
  };
}