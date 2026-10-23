import "reflect-metadata";
import { DataSource } from "typeorm";
import { env } from "./env";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: env.DB_HOST,
  port: env.DB_PORT,
  username: env.DB_USERNAME,
  password: env.DB_PASSWORD,
  database: env.DB_DATABASE,
  synchronize: false, // OBLIGATORIO: Usaremos migraciones
  migrations: ["src/database/migrations/*.ts"],
  entities: ["src/modules/**/*.entity.ts"],
  logging: env.NODE_ENV === "development", // Solo muestra queries SQL en dev
});
