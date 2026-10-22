import { Router } from "express";
import {
  getShelves,
  getShelfById,
  createShelf,
  updateShelf,
  deleteShelf,
} from "./shelves.controller";

const router = Router();

router.get("/", getShelves);
router.get("/:id", getShelfById);
router.post("/", createShelf);
router.put("/:id", updateShelf);
router.delete("/:id", deleteShelf);

export default router;
