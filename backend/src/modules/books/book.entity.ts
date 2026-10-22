import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Author } from '../authors/author.entity';
import { Genre } from '../genres/genre.entity';
import { Saga } from '../sagas/saga.entity';
import { Shelf } from '../shelves/shelf.entity';

@Entity('books')
export class Book {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column({ nullable: true })
  isbn?: string;

  @Column({ type: 'int', nullable: true })
  year?: number;

  @ManyToOne(() => Author, (author) => author.books, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'authorId' })
  author!: Author;

  @Column()
  authorId!: number;

  @ManyToOne(() => Genre, (genre) => genre.books, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'genreId' })
  genre!: Genre;

  @Column()
  genreId!: number;

  @ManyToOne(() => Saga, (saga) => saga.books, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'sagaId' })
  saga?: Saga;

  @Column({ nullable: true })
  sagaId?: number;

  @ManyToOne(() => Shelf, (shelf) => shelf.books, { nullable: false, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'shelfId' })
  shelf!: Shelf;

  @Column()
  shelfId!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}