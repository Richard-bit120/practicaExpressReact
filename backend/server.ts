import dotenv from "dotenv";
import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import cors from "cors";
import { AppDataSource } from "./database/data-source";
import { requestLoggerMiddleware } from "./middlewares/requestLogger";
import { validateBodyMiddleware } from "./middlewares/validateBody";
import { errorHandlerMiddleware } from "./middlewares/errorHandler";
import { authenticateSimuladoMiddleware } from "./middlewares/authenticateSimulado";
import { authorizeRoleMiddleware } from "./middlewares/authorizeRole";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use(requestLoggerMiddleware);

app.get("/api/prueba", (req: Request, res: Response) => {
  res.json({ message: "Hello from Express con TypeScript y TSX!" });
});

app.post(
  "/api/users/register",
  validateBodyMiddleware(["email", "password"]),
  (req: Request, res: Response) => {
    res
      .status(201)
      .json({ message: "Usuario registrado exitosamente", data: req.body });
  },
);

app.post(
  "/api/products",
  validateBodyMiddleware(["nombre", "precio", "stock"]),
  (req: Request, res: Response) => {
    res.status(201).json({
      message: "Producto creado con exito",
      data: req.body,
    });
  },
);

app.get(
  "/api/admin/dashboard",
  authenticateSimuladoMiddleware,
  authorizeRoleMiddleware("admin"),
  (req: Request, res: Response) => {
    res.json({
      message: "Bienvenido al panel de administracion secreto!",
      userData: req.user,
    });
  },
);

app.get(
  "/api/forzar-error",
  (req: Request, res: Response, next: NextFunction) => {
    const error: any = new Error(
      "Simulacion: La base de datos MySQL se ha desconectado.",
    );
    error.statusCode = 503;
    next(error);
  },
);

app.use(errorHandlerMiddleware);

const start = async () => {
  try {
    await AppDataSource.initialize();
    console.log("Base de datos MySQL conectada con exito");

    app.listen(PORT, () => {
      console.log(`Servidor TS corriendo en http:${PORT}`);
    });
  } catch (error) {
    console.error("Error al conectar a MySQL:", error);
    process.exit(1);
  }
};

start();
