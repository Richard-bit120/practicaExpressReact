import { Router } from "express";
import { DashboardController } from "./dashboard.controller";
import { authMiddleware } from "../../shared/middlewares/auth.middleware";

const router = Router();
const controller = new DashboardController();

// El endpoint queda protegido y el contexto de 'this' asegurado
router.get("/stats", authMiddleware, (req, res, next) =>
  controller.getStats(req, res, next),
);

export default router;
