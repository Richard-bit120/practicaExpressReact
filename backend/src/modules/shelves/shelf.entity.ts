import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import { Book } from "../books/book.entity";

@Entity("shelves")
export class Shelf {
  @PrimaryGeneratedColumn()
  id!: number;

  // Se añade explícitamente el tipo "varchar" para corregir ColumnTypeUndefinedError
  @Column({ type: "varchar", length: 50, unique: true })
  code!: string; // Agregado operador '!' para tipado estricto

  // Se añade explícitamente el tipo "varchar"
  @Column({ type: "varchar", length: 150, nullable: true })
  location!: string | null; // Agregado operador '!' para tipado estricto

  @Column({ type: "text", nullable: true })
  description!: string | null; // Agregado operador '!' para tipado estricto

  @OneToMany(() => Book, (book) => book.shelf)
  books!: Book[]; // Agregado operador '!' para tipado estricto

  @CreateDateColumn()
  createdAt!: Date; // Agregado operador '!' para tipado estricto

  @UpdateDateColumn()
  updatedAt!: Date; // Agregado operador '!' para tipado estricto
}
