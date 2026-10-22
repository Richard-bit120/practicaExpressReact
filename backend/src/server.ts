// src/server.ts
import app from "./app";
import { env } from "./config/env";
import { AppDataSource } from "./config/data-source";
import { logger } from "./shared/logging/logger";

const startServer = async () => {
  try {
    // 1. Inicializar conexión a Base de Datos
    await AppDataSource.initialize();
    logger.info(
      "Conexión a la base de datos (SQLite) establecida exitosamente.",
    );

    // 2. Iniciar servidor Express
    app.listen(env.PORT, () => {
      logger.info(
        `Servidor ejecutándose en http://localhost:${env.PORT} en modo ${env.NODE_ENV}`,
      );
    });
  } catch (error) {
    logger.error("Error al iniciar el servidor:", error);
    process.exit(1);
  }
};

startServer();
