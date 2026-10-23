import dotenv from "dotenv";
dotenv.config();

export const env = {
  PORT: parseInt(process.env.PORT || "3000", 10),
  NODE_ENV: process.env.NODE_ENV || "development",

  DB_HOST: process.env.DB_HOST || "localhost",
  DB_PORT: parseInt(process.env.DB_PORT || "3306", 10),
  DB_USERNAME: process.env.DB_USERNAME || "root",
  DB_PASSWORD: process.env.DB_PASSWORD || "",
  DB_DATABASE: process.env.DB_DATABASE || "biblioteca_db",

  JWT_SECRET: process.env.JWT_SECRET || "default_secret",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "8h",

  ADMIN_USER: process.env.ADMIN_USER || "admin",
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || "password",

  FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:5173",
};

// Validación rápida en producción
if (env.NODE_ENV === "production") {
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET === "default_secret") {
    throw new Error("FATAL: JWT_SECRET no está configurado en producción.");
  }
}
