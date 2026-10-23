import { Repository, Between, Like, FindOptionsWhere } from "typeorm";
import { AppDataSource } from "../../config/data-source";
import { Log } from "./log.entity";

export interface LogEntry {
  level: string;
  event: string;
  message: string;
  method?: string;
  path?: string;
  statusCode?: number;
  responseTime?: number;
  metadata?: Record<string, any>;
}

export interface LogFilterParams {
  level?: string;
  event?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}

export class LogsService {
  private logRepository: Repository<Log>;

  constructor() {
    this.logRepository = AppDataSource.getRepository(Log);
  }

  async write(entry: LogEntry): Promise<void> {
    try {
      const log = this.logRepository.create({
        level: entry.level,
        event: entry.event,
        message: entry.message,
        method: entry.method || null,
        path: entry.path || null,
        statusCode: entry.statusCode || null,
        responseTime: entry.responseTime || null,
        metadata: entry.metadata ? JSON.stringify(entry.metadata) : null,
      });
      await this.logRepository.save(log);
    } catch (error) {
      // Si falla la escritura en BD, loguear en consola para no perder el registro
      console.error(
        `[LOG WRITE ERROR] ${entry.level}: ${entry.message}`,
        error,
      );
    }
  }

  async findAll(params: LogFilterParams) {
    const { level, event, dateFrom, dateTo, page = 1, limit = 50 } = params;
    const skip = (page - 1) * limit;

    const queryBuilder = this.logRepository
      .createQueryBuilder("log")
      .orderBy("log.createdAt", "DESC")
      .skip(skip)
      .take(limit);

    if (level) {
      queryBuilder.andWhere("log.level = :level", { level });
    }

    if (event) {
      queryBuilder.andWhere("log.event = :event", { event });
    }

    if (dateFrom) {
      queryBuilder.andWhere("log.createdAt >= :dateFrom", { dateFrom });
    }

    if (dateTo) {
      // Agregar un día para incluir todo el día de "hasta"
      const endDate = new Date(dateTo);
      endDate.setDate(endDate.getDate() + 1);
      queryBuilder.andWhere("log.createdAt < :dateTo", {
        dateTo: endDate.toISOString(),
      });
    }

    const [logs, total] = await queryBuilder.getManyAndCount();

    return {
      data: logs,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async cleanup(daysToKeep: number = 30): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

    const result = await this.logRepository
      .createQueryBuilder()
      .delete()
      .from(Log)
      .where("createdAt < :cutoffDate", { cutoffDate })
      .execute();

    return result.affected || 0;
  }
}
