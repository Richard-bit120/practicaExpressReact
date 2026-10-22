import { AppDataSource } from '../../config/data-source';
import { Log } from '../../modules/logs/log.entity';

export class LogStorage {
  static async saveLog(level: string, event: string, message: string): Promise<void> {
    try {
      if (!AppDataSource.isInitialized) return;
      const logRepository = AppDataSource.getRepository(Log);
      const log = logRepository.create({ level, event, message });
      await logRepository.save(log);
    } catch {
      // Evitar bucle infinito si falla el log
    }
  }
}