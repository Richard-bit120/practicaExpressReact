// src/routes/dashboard.routes.ts
import { Router } from "express";
import { getDashboardStats } from "../dashboard/dashboard.controller";
import { authMiddleware } from "../../shared/middlewares/auth.middleware"; // Valida el JsonWebToken

const router = Router();

// Protegemos el endpoint con el middleware JWT
router.get("/stats", authMiddleware, getDashboardStats);

export default router;
