import 'reflect-metadata';
import app from './app';
import { ENV } from './config/env';
import { AppDataSource } from './config/data-source';
import { Logger } from './shared/logging/logger';

async function main() {
  try {
    await AppDataSource.initialize();
    Logger.info('DB_INIT', 'Base de datos conectada e inicializada correctamente.');

    app.listen(ENV.PORT, () => {
      Logger.info('SERVER_START', `Servidor corriendo en puerto ${ENV.PORT}`);
    });
  } catch (error) {
    Logger.error('SERVER_START_ERROR', `Error al iniciar el servidor: ${error}`);
    process.exit(1);
  }
}

main();