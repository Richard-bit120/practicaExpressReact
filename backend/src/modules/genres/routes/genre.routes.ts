import { Router } from "express";
import { GenreController } from "../controllers/GenreController";
import { validateSchema } from "../../../shared/middlewares/validateSchema";
import {
  createGenreSchema,
  updateGenreSchema,
} from "../validations/genre.schema";

const router = Router();
const controller = new GenreController();

router.post("/", validateSchema(createGenreSchema), controller.create);
router.get("/", controller.getAll);
router.get("/:id", controller.getById);
router.put("/:id", validateSchema(updateGenreSchema), controller.update);
router.delete("/:id", controller.delete);

export default router;
