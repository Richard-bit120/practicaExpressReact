import { Request, Response } from "express";
import { DashboardService } from "./dashboard.service";
import { asyncHandler } from "../../shared/utils/async-handler";
import { HTTP_STATUS } from "../../shared/constants/http-status";

export class DashboardController {
  // Instanciamos el servicio directamente para mantener el código limpio
  private dashboardService = new DashboardService();

  // GET /dashboard/stats -> Obtiene las estadísticas generales
  getStats = asyncHandler(async (req: Request, res: Response) => {
    // Aquí no necesitamos req.body, ni req.query, ni req.params
    // porque las estadísticas generales no dependen de un ID ni de una búsqueda.
    const stats = await this.dashboardService.getStats();

    // Devolvemos el objeto con las estadísticas al cliente (ej: total de libros, autores, etc.)
    res.status(HTTP_STATUS.OK).json(stats);
  });
}