import { AppDataSource } from "../../config/database";
import { Book } from "./book.entity";
import { Author } from "../authors/author.entity";
import { Genre } from "../genres/genre.entity";
import { Shelf } from "../shelves/shelf.entity";
import { Saga } from "../sagas/saga.entity";
import logger from "../../shared/logger";
import { logsService } from "../logs/logs.service";
import { LogLevel, LogEvent } from "../logs/logs.entity";

export interface BookFilters {
  genreId?: number;
  authorId?: number;
  year?: number;
  page?: number;
  limit?: number;
}

export class BooksService {
  private bookRepo = AppDataSource.getRepository(Book);
  private authorRepo = AppDataSource.getRepository(Author);
  private genreRepo = AppDataSource.getRepository(Genre);
  private shelfRepo = AppDataSource.getRepository(Shelf);
  private sagaRepo = AppDataSource.getRepository(Saga);

  async getCatalog(
    filters: BookFilters,
  ): Promise<{ data: Book[]; total: number }> {
    const { genreId, authorId, year, page = 1, limit = 10 } = filters;
    const query = this.bookRepo
      .createQueryBuilder("book")
      .leftJoinAndSelect("book.author", "author")
      .leftJoinAndSelect("book.genre", "genre")
      .leftJoinAndSelect("book.shelf", "shelf")
      .leftJoinAndSelect("book.saga", "saga");

    if (genreId) query.andWhere("book.genreId = :genreId", { genreId });
    if (authorId) query.andWhere("book.authorId = :authorId", { authorId });
    if (year) query.andWhere("book.year = :year", { year });

    query.skip((page - 1) * limit).take(limit);

    const [data, total] = await query.getManyAndCount();
    return { data, total };
  }

  async getById(id: number): Promise<Book | null> {
    return this.bookRepo.findOne({
      where: { id },
      relations: ["author", "genre", "shelf", "saga"],
    });
  }

  async create(data: any): Promise<Book> {
    await this.validateRelations(data);
    const book = this.bookRepo.create(data);
    const saved = await this.bookRepo.save(book);

    logger.info(`Libro registrado: ${saved.title}`);

    // Log del sistema para la creación del libro
    await logsService.createLog({
      level: LogLevel.INFO,
      event: LogEvent.CRUD,
      message: `Nuevo libro creado: ${saved.title}`,
      metadata: { bookId: saved.id, action: "CREATE" },
    });

    return saved;
  }

  async update(id: number, data: any): Promise<Book | null> {
    const book = await this.bookRepo.findOneBy({ id });
    if (!book) return null;

    await this.validateRelations(data);
    this.bookRepo.merge(book, data);
    const updated = await this.bookRepo.save(book);
    logger.info(`Libro actualizado: ID ${id}`);
    return updated;
  }

  async delete(id: number): Promise<boolean> {
    try {
      const result = await this.bookRepo.delete(id);
      if (result.affected) {
        logger.info(`Libro eliminado: ID ${id}`);
        return true;
      }
      return false;
    } catch (error: any) {
      // Captura errores de restricción de integridad (ej: llaves foráneas activas)
      await logsService.createLog({
        level: LogLevel.ERROR,
        event: LogEvent.CRUD,
        message: "Fallo al eliminar recurso: Restricción de integridad",
        metadata: {
          resourceId: id,
          resourceType: "Book",
          error: error.message,
        },
      });

      throw error; // Re-lanzamos el error para que el controlador lo maneje
    }
  }

  // REGLA: Verificar existencia de entidades relacionadas
  private async validateRelations(data: any) {
    if (data.author) {
      const author = await this.authorRepo.findOneBy({ id: data.author });
      if (!author) throw new Error("El Autor proporcionado no existe.");
    }
    if (data.genre) {
      const genre = await this.genreRepo.findOneBy({ id: data.genre });
      if (!genre) throw new Error("El Género proporcionado no existe.");
    }
    if (data.shelf) {
      const shelf = await this.shelfRepo.findOneBy({ id: data.shelf });
      if (!shelf) throw new Error("El Estante proporcionado no existe.");
    }
    if (data.saga) {
      const saga = await this.sagaRepo.findOneBy({ id: data.saga });
      if (!saga) throw new Error("La Saga proporcionada no existe.");
    }
  }
}
