import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
// Importación futura: import { Book } from '../../books/entities/Book.entity';

@Entity("authors")
export class Author {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", length: 150 })
  name: string;

  @Column({ type: "text", nullable: true })
  biography: string;

  @Column({ type: "date", nullable: true })
  birthDate: Date;

  // Relación preparada para la Fase de Libros. NO usar onUpdate/onDelete CASCADE.
  // @OneToMany(() => Book, (book) => book.author)
  // books: Book[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
