import { AppDataSource } from "../../../config/database";
import { Author } from "../entities/Author.entity";
import { AppError } from "../../../shared/errors/AppError";

export class AuthorService {
  private authorRepository = AppDataSource.getRepository(Author);

  async create(data: Partial<Author>): Promise<Author> {
    const author = this.authorRepository.create(data);
    return await this.authorRepository.save(author);
  }

  async findAll(): Promise<Author[]> {
    return await this.authorRepository.find();
  }

  async findById(id: string): Promise<Author> {
    const author = await this.authorRepository.findOne({ where: { id } });
    if (!author) throw new AppError("Autor no encontrado", 404);
    return author;
  }

  async update(id: string, data: Partial<Author>): Promise<Author> {
    const author = await this.findById(id);
    Object.assign(author, data);
    return await this.authorRepository.save(author);
  }

  async delete(id: string): Promise<void> {
    const author = await this.authorRepository.findOne({
      where: { id },
      relations: ["books"], // Precarga los libros para verificar la regla de negocio
    });

    if (!author) throw new AppError("Autor no encontrado", 404);

    // Regla de Negocio: No borrar Autores si tienen libros
    if (author.books && author.books.length > 0) {
      throw new AppError(
        "Conflicto: No se puede eliminar el autor porque tiene libros asociados",
        409,
      );
    }

    await this.authorRepository.remove(author);
  }
}
