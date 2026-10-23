import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Author } from "../authors/author.entity";
import { Genre } from "../genres/genre.entity";
import { Saga } from "../sagas/saga.entity";
import { Shelf } from "../shelves/shelf.entity";

@Entity("books")
export class Book {
  @PrimaryGeneratedColumn()
  id!: number; // Agregado operador '!' para TypeScript estricto

  // Se asigna explícitamente el tipo "varchar" para evitar ColumnTypeUndefinedError con tsx
  @Column({ type: "varchar", length: 255 })
  title!: string;

  // Se asigna explícitamente el tipo "varchar"
  @Column({ type: "varchar", length: 17, nullable: true })
  isbn!: string | null;

  @Column({ type: "int", nullable: true })
  year!: number | null;

  @ManyToOne(() => Author, (author) => author.books, {
    nullable: false,
    onDelete: "RESTRICT",
  })
  @JoinColumn({ name: "authorId" })
  author!: Author;

  // Se especifica explícitamente type: "int" en la clave foránea
  @Column({ type: "int" })
  authorId!: number;

  @ManyToOne(() => Genre, (genre) => genre.books, {
    nullable: false,
    onDelete: "RESTRICT",
  })
  @JoinColumn({ name: "genreId" })
  genre!: Genre;

  // Se especifica explícitamente type: "int" en la clave foránea
  @Column({ type: "int" })
  genreId!: number;

  @ManyToOne(() => Shelf, (shelf) => shelf.books, {
    nullable: false,
    onDelete: "RESTRICT",
  })
  @JoinColumn({ name: "shelfId" })
  shelf!: Shelf;

  // Se especifica explícitamente type: "int" en la clave foránea
  @Column({ type: "int" })
  shelfId!: number;

  @ManyToOne(() => Saga, (saga) => saga.books, {
    nullable: true,
    onDelete: "SET NULL",
  })
  @JoinColumn({ name: "sagaId" })
  saga!: Saga | null;

  // Se especifica explícitamente type: "int" con nullable en la clave foránea
  @Column({ type: "int", nullable: true })
  sagaId!: number | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
