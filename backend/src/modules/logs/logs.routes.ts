import { Router } from "express";
import { logsController } from "./logs.controller";
import { authMiddleware } from "../../shared/middlewares/auth.middleware"; // Tu middleware JWT

const router = Router();

// Endpoint protegido
router.get("/", authMiddleware, logsController.getLogs);

export default router;
