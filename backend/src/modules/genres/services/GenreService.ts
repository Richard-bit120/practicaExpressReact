import { AppDataSource } from "../../../config/database";
import { Genre } from "../entities/Genre.entity";
import { AppError } from "../../../shared/errors/AppError";

export class GenreService {
  private genreRepository = AppDataSource.getRepository(Genre);

  async create(data: Partial<Genre>): Promise<Genre> {
    // Regla de Negocio: Evitar duplicados
    const existing = await this.genreRepository.findOne({
      where: { name: data.name },
    });
    if (existing) {
      throw new AppError(`Conflicto: El género '${data.name}' ya existe`, 409);
    }

    const genre = this.genreRepository.create(data);
    return await this.genreRepository.save(genre);
  }

  async findAll(): Promise<Genre[]> {
    return await this.genreRepository.find();
  }

  async findById(id: string): Promise<Genre> {
    const genre = await this.genreRepository.findOne({ where: { id } });
    if (!genre) throw new AppError("Género no encontrado", 404);
    return genre;
  }

  async update(id: string, data: Partial<Genre>): Promise<Genre> {
    const genre = await this.findById(id);

    if (data.name && data.name !== genre.name) {
      const existing = await this.genreRepository.findOne({
        where: { name: data.name },
      });
      if (existing)
        throw new AppError(
          `Conflicto: El género '${data.name}' ya existe`,
          409,
        );
    }

    Object.assign(genre, data);
    return await this.genreRepository.save(genre);
  }

  async delete(id: string): Promise<void> {
    const genre = await this.genreRepository.findOne({
      where: { id },
      relations: ["books"], // Precarga relación con libros
    });

    if (!genre) throw new AppError("Género no encontrado", 404);

    // Regla de Negocio: No borrar Géneros si tienen libros
    if (genre.books && genre.books.length > 0) {
      throw new AppError(
        "Conflicto: No se puede eliminar el género porque tiene libros asociados",
        409,
      );
    }

    await this.genreRepository.remove(genre);
  }
}
