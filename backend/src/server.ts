import "reflect-metadata";
import app from "./app";
import { env } from "./config/env";
import { AppDataSource } from "./config/data-source";
import { logger } from "./shared/logging/logger";

const startServer = async () => {
  try {
    // 1. Conectar a la base de datos MySQL
    await AppDataSource.initialize();
    logger.info("✅ Conexión a MySQL establecida correctamente.");

    // 2. Iniciar servidor HTTP
    app.listen(env.PORT, () => {
      logger.info(
        `🚀 Servidor corriendo en puerto ${env.PORT} en modo ${env.NODE_ENV}`,
      );
    });
  } catch (error) {
    logger.error("❌ Error fatal al iniciar el servidor:", error);
    process.exit(1);
  }
};

startServer();
