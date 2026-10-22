import { AppDataSource } from '../../config/data-source';
import { Log } from './log.entity';
import { ILogQuery } from './logs.types';

export class LogsService {
  private repo = AppDataSource.getRepository(Log);

  async findAll(query: ILogQuery): Promise<Log[]> {
    const qb = this.repo.createQueryBuilder('log').orderBy('log.createdAt', 'DESC');

    if (query.level) {
      qb.andWhere('log.level = :level', { level: query.level });
    }

    if (query.startDate) {
      qb.andWhere('log.createdAt >= :startDate', { startDate: new Date(query.startDate) });
    }

    if (query.endDate) {
      qb.andWhere('log.createdAt <= :endDate', { endDate: new Date(query.endDate) });
    }

    if (query.limit) {
      qb.take(Number(query.limit));
    } else {
      qb.take(100); // Límite por defecto para evitar sobrecarga de memoria
    }

    return qb.getMany();
  }
}