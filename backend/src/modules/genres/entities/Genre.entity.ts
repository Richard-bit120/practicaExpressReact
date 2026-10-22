import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
} from "typeorm";
// Importación futura: import { Book } from '../../books/entities/Book.entity';

@Entity("genres")
export class Genre {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  // constraint UNIQUE en base de datos para evitar duplicados
  @Column({ type: "varchar", length: 50, unique: true })
  name: string;

  @Column({ type: "text", nullable: true })
  description: string;

  // Relación preparada para la Fase de Libros.
  // @ManyToMany(() => Book, (book) => book.genres)
  // books: Book[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
