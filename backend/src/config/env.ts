import dotenv from "dotenv";

dotenv.config();

interface EnvVars {
  NODE_ENV: string;
  PORT: number;
  DB_DATABASE: string;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
}

const getEnv = (): EnvVars => {
  const env = {
    NODE_ENV: process.env.NODE_ENV || "development",
    PORT: Number(process.env.PORT) || 3000,
    DB_DATABASE: process.env.DB_DATABASE || "database.sqlite",
    JWT_SECRET: process.env.JWT_SECRET || "",
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "24h",
  };

  const missingKeys = Object.entries(env)
    .filter(([_, value]) => value === undefined || value === "")
    .map(([key]) => key);

  if (missingKeys.length > 0) {
    throw new Error(
      `Faltan variables de entorno requeridas: ${missingKeys.join(", ")}`,
    );
  }

  return env;
};

export const env = getEnv();
