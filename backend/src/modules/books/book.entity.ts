import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Author } from "../authors/author.entity";
import { Genre } from "../genres/genre.entity";
import { Shelf } from "../shelves/shelf.entity";
import { Saga } from "../sagas/saga.entity";

@Entity("books")
export class Book {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 200 })
  title: string;

  @Column({ type: "int" })
  year: number;

  @Column({ type: "varchar", length: 50, unique: true, nullable: true })
  isbn: string;

  // REGLA: Obligatorio, si se borra el autor lanza error (RESTRICT)
  @ManyToOne(() => Author, { nullable: false, onDelete: "RESTRICT" })
  @JoinColumn({ name: "authorId" })
  author: Author;

  // REGLA: Obligatorio, si se borra el género lanza error (RESTRICT)
  @ManyToOne(() => Genre, { nullable: false, onDelete: "RESTRICT" })
  @JoinColumn({ name: "genreId" })
  genre: Genre;

  // REGLA: Obligatorio, si se borra el estante lanza error (RESTRICT)
  @ManyToOne(() => Shelf, (shelf) => shelf.books, {
    nullable: false,
    onDelete: "RESTRICT",
  })
  @JoinColumn({ name: "shelfId" })
  shelf: Shelf;

  // REGLA: Opcional, si se borra la saga, queda en NULL
  @ManyToOne(() => Saga, (saga) => saga.books, {
    nullable: true,
    onDelete: "SET NULL",
  })
  @JoinColumn({ name: "sagaId" })
  saga: Saga;
}
