import { AppDataSource } from "../../config/data-source";
import { Book } from "../books/book.entity";
import { Author } from "../authors/author.entity";
import { Genre } from "../genres/genre.entity";
import { Saga } from "../sagas/saga.entity";
import { Shelf } from "../shelves/shelf.entity";

export class DashboardService {
  async getStats() {
    // Ejecutamos todos los COUNT en paralelo directamente en la base de datos
    const [books, authors, genres, sagas, shelves] = await Promise.all([
      AppDataSource.getRepository(Book).count(),
      AppDataSource.getRepository(Author).count(),
      AppDataSource.getRepository(Genre).count(),
      AppDataSource.getRepository(Saga).count(),
      AppDataSource.getRepository(Shelf).count(),
    ]);

    return {
      books,
      authors,
      genres,
      sagas,
      shelves,
    };
  }
}
