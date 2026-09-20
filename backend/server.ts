import dotenv from "dotenv";
import express, { type Request, type Response } from "express";
import cors from "cors";
import { AppDataSource } from "./database/data-source";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/api/prueba", (req: Request, res: Response) => {
  res.json({ message: "Hello from Express con TypeScript y TSX!" });
});

const start = async () => {
  try {
    await AppDataSource.initialize();
    console.log("Base de datos MySQL conectada con exito");

    app.listen(PORT, () => {
      console.log(`Servidor TS corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Error al conectar a MySQL:", error);
    process.exit(1);
  }
};

start();
