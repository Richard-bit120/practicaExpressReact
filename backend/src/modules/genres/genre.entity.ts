import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import { Book } from "../books/book.entity";

@Entity("genres")
export class Genre {
  @PrimaryGeneratedColumn()
  id!: number; // Agregado operator '!' para inicialización estricta de TypeScript

  // Se especifica explícitamente type: "varchar" para evitar ColumnTypeUndefinedError con tsx
  @Column({ type: "varchar", length: 100, unique: true })
  name!: string; // Agregado operator '!'

  @Column({ type: "text", nullable: true })
  description!: string | null; // Agregado operator '!'

  @OneToMany(() => Book, (book) => book.genre)
  books!: Book[]; // Agregado operator '!'

  @CreateDateColumn()
  createdAt!: Date; // Agregado operator '!'

  @UpdateDateColumn()
  updatedAt!: Date; // Agregado operator '!'
}
