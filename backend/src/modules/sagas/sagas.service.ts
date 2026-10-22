import { AppDataSource } from "../../config/database";
import { Saga } from "./saga.entity";
import logger from "../../shared/logger";

export class SagasService {
  private sagaRepository = AppDataSource.getRepository(Saga);

  async getAll(): Promise<Saga[]> {
    return this.sagaRepository.find();
  }

  async getById(id: number): Promise<Saga | null> {
    return this.sagaRepository.findOne({ where: { id } });
  }

  async create(data: Partial<Saga>): Promise<Saga> {
    const saga = this.sagaRepository.create(data);
    const saved = await this.sagaRepository.save(saga);
    logger.info(`Saga creada con ID: ${saved.id}`);
    return saved;
  }

  async update(id: number, data: Partial<Saga>): Promise<Saga | null> {
    const saga = await this.getById(id);
    if (!saga) return null;

    this.sagaRepository.merge(saga, data);
    const updated = await this.sagaRepository.save(saga);
    logger.info(`Saga actualizada con ID: ${id}`);
    return updated;
  }

  async delete(id: number): Promise<boolean> {
    // Al borrar la saga, TypeORM ejecutará SET NULL en los libros gracias a la configuración en BookEntity
    const result = await this.sagaRepository.delete(id);
    if (result.affected) {
      logger.info(`Saga eliminada con ID: ${id}`);
      return true;
    }
    return false;
  }
}
