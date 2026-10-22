import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Book } from "../books/book.entity";

@Entity("sagas")
export class Saga {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 150 })
  name: string;

  @Column({ type: "text", nullable: true })
  description: string;

  // REGLA: Al borrar saga, no se borran los libros. Se maneja en la entidad Book con onDelete: 'SET NULL'
  @OneToMany(() => Book, (book) => book.saga)
  books: Book[];
}
