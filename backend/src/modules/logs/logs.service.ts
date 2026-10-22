import { AppDataSource } from "../../config/database"; // Ajusta la ruta a tu DataSource
import { Log, LogLevel, LogEvent } from "./logs.entity";

export class LogsService {
  private logRepository = AppDataSource.getRepository(Log);

  async createLog(data: {
    level: LogLevel;
    event: LogEvent;
    message: string;
    metadata?: any;
  }) {
    try {
      const log = this.logRepository.create(data);
      await this.logRepository.save(log);
    } catch (error) {
      // Evitamos que un fallo en el logger rompa el flujo principal
      console.error("Error al guardar el log en BD:", error);
    }
  }

  async getLogs(filters: {
    level?: LogLevel;
    startDate?: string;
    endDate?: string;
  }) {
    const queryBuilder = this.logRepository.createQueryBuilder("log");

    if (filters.level) {
      queryBuilder.andWhere("log.level = :level", { level: filters.level });
    }

    if (filters.startDate) {
      queryBuilder.andWhere("log.createdAt >= :startDate", {
        startDate: filters.startDate,
      });
    }

    if (filters.endDate) {
      queryBuilder.andWhere("log.createdAt <= :endDate", {
        endDate: filters.endDate,
      });
    }

    queryBuilder.orderBy("log.createdAt", "DESC");

    return await queryBuilder.getMany();
  }
}

export const logsService = new LogsService();
