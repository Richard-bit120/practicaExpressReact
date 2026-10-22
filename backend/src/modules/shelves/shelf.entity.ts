import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Book } from "../books/book.entity";

@Entity("shelves")
export class Shelf {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 100 })
  name: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  description: string;

  // Un estante puede tener muchos libros.
  @OneToMany(() => Book, (book) => book.shelf)
  books: Book[];
}
