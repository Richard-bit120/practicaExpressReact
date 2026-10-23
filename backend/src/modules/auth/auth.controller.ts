import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { asyncHandler } from "../../shared/utils/async-handler";
import { HTTP_STATUS } from "../../shared/constants/http-status";

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  public login = asyncHandler(async (req: Request, res: Response) => {
    const { username, password } = req.body;
    const result = await this.authService.login(username, password);
    res.status(HTTP_STATUS.OK).json(result);
  });
}
