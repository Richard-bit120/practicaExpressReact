import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
// Se corrige la ruta de importación. Verifica si la carpeta es 'book' o 'books', o si el archivo existe.
import { Book } from "../books/book.entity";

@Entity("sagas")
export class Saga {
  @PrimaryGeneratedColumn()
  id!: number; // Agregado operator '!' para TypeScript estricto

  // Se incluye el tipo "varchar" explícitamente para solucionar ColumnTypeUndefinedError con tsx
  @Column({ type: "varchar", length: 150 })
  name!: string;

  @Column({ type: "text", nullable: true })
  description!: string | null;

  // Al resolverse la importación correcta de Book, el parámetro 'book' deja de ser 'unknown'
  @OneToMany(() => Book, (book) => book.saga)
  books!: Book[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
