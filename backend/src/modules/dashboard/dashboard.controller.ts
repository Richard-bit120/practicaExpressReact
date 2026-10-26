import { Request, Response } from "express";
import { DashboardService } from "./dashboard.service";
import { asyncHandler } from "../../shared/utils/async-handler";
import { HTTP_STATUS } from "../../shared/constants/http-status";

export class DashboardController {
  private readonly dashboardService: DashboardService;

  constructor(dashboardService?: DashboardService) {
    this.dashboardService = dashboardService ?? new DashboardService();
  }

  getStats = asyncHandler(async (req: Request, res: Response) => {
    const stats = await this.dashboardService.getStats();

    // Retornamos el objeto plano como lo tenías originalmente
    res.status(HTTP_STATUS.OK).json(stats);
  });
}
