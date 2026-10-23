import { Router } from "express";
import { LogsController } from "./logs.controller";

const router = Router();
const controller = new LogsController();

router.get("/", controller.list);
router.delete("/cleanup", controller.cleanup);

export default router;
