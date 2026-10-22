import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { ENV } from './env';
import { Admin } from '../modules/auth/admin.entity';
import { Author } from '../modules/authors/author.entity';
import { Genre } from '../modules/genres/genre.entity';
import { Saga } from '../modules/sagas/saga.entity';
import { Shelf } from '../modules/shelves/shelf.entity';
import { Book } from '../modules/books/book.entity';
import { Log } from '../modules/logs/log.entity';

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: ENV.DB_DATABASE,
  synchronize: ENV.NODE_ENV === 'development', // Sincronización automática para desarrollo académico ágil
  logging: false,
  entities: [Admin, Author, Genre, Saga, Shelf, Book, Log],
  migrations: ['src/database/migrations/*.ts'],
  subscribers: [],
});