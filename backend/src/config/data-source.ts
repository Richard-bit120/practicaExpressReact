import "reflect-metadata";
import { DataSource } from "typeorm";
import { env } from "./env";
import path from "path";

export const AppDataSource = new DataSource({
  type: "sqlite",
  database: env.DB_DATABASE,
  synchronize: false, // Strict: 100% gestionado por migraciones
  logging: env.NODE_ENV === "development" ? ["query", "error"] : ["error"],
  entities: [path.join(__dirname, "../modules/**/*.entity.{ts,js}")],
  migrations: [path.join(__dirname, "../migrations/**/*.{ts,js}")],
  subscribers: [],
});
