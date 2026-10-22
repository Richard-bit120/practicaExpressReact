import { AppDataSource } from "../../config/database";
import { Shelf } from "./shelf.entity";
import { Book } from "../books/book.entity";
import logger from "../../shared/logger";

export class ShelvesService {
  private shelfRepository = AppDataSource.getRepository(Shelf);
  private bookRepository = AppDataSource.getRepository(Book);

  async getAll(): Promise<Shelf[]> {
    return this.shelfRepository.find();
  }

  async getById(id: number): Promise<Shelf | null> {
    return this.shelfRepository.findOne({ where: { id } });
  }

  async create(data: Partial<Shelf>): Promise<Shelf> {
    const shelf = this.shelfRepository.create(data);
    const saved = await this.shelfRepository.save(shelf);
    logger.info(`Estante creado con ID: ${saved.id}`);
    return saved;
  }

  async update(id: number, data: Partial<Shelf>): Promise<Shelf | null> {
    const shelf = await this.getById(id);
    if (!shelf) return null;

    this.shelfRepository.merge(shelf, data);
    const updated = await this.shelfRepository.save(shelf);
    logger.info(`Estante actualizado con ID: ${id}`);
    return updated;
  }

  async delete(id: number): Promise<boolean> {
    // REGLA DE NEGOCIO: No borrar estantes si tienen libros
    const booksCount = await this.bookRepository.count({
      where: { shelf: { id } },
    });
    if (booksCount > 0) {
      throw new Error("No se puede eliminar un estante que contiene libros.");
    }

    const result = await this.shelfRepository.delete(id);
    if (result.affected) {
      logger.info(`Estante eliminado con ID: ${id}`);
      return true;
    }
    return false;
  }
}
