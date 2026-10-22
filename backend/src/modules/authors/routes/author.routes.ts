import { Router } from "express";
import { AuthorController } from "../controllers/AuthorController";
import { validateSchema } from "../../../shared/middlewares/validateSchema";
import {
  createAuthorSchema,
  updateAuthorSchema,
} from "../validations/author.schema";
// Importar middleware de auth para validar que sea admin (implementado en Fase de Auth)

const router = Router();
const controller = new AuthorController();

router.post("/", validateSchema(createAuthorSchema), controller.create);
router.get("/", controller.getAll);
router.get("/:id", controller.getById);
router.put("/:id", validateSchema(updateAuthorSchema), controller.update);
router.delete("/:id", controller.delete);

export default router;
