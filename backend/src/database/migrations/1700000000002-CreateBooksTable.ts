import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from "typeorm";

export class CreateBooksTable1700000000002 implements MigrationInterface {
  name = "CreateBooksTable1700000000002";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "books",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          { name: "title", type: "varchar", length: "255" },
          { name: "isbn", type: "varchar", length: "17", isNullable: true },
          { name: "year", type: "int", isNullable: true },
          { name: "authorId", type: "int" },
          { name: "genreId", type: "int" },
          { name: "shelfId", type: "int" },
          { name: "sagaId", type: "int", isNullable: true },
          {
            name: "createdAt",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
          },
          {
            name: "updatedAt",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
            onUpdate: "CURRENT_TIMESTAMP",
          },
        ],
      }),
      true,
    );

    // Índices para optimizar filtros
    await queryRunner.createIndex(
      "books",
      new TableIndex({
        name: "IDX_books_authorId",
        columnNames: ["authorId"],
      }),
    );

    await queryRunner.createIndex(
      "books",
      new TableIndex({
        name: "IDX_books_genreId",
        columnNames: ["genreId"],
      }),
    );

    await queryRunner.createIndex(
      "books",
      new TableIndex({
        name: "IDX_books_shelfId",
        columnNames: ["shelfId"],
      }),
    );

    await queryRunner.createIndex(
      "books",
      new TableIndex({
        name: "IDX_books_sagaId",
        columnNames: ["sagaId"],
      }),
    );

    await queryRunner.createIndex(
      "books",
      new TableIndex({
        name: "IDX_books_year",
        columnNames: ["year"],
      }),
    );

    // Claves foráneas
    await queryRunner.createForeignKey(
      "books",
      new TableForeignKey({
        name: "FK_books_author",
        columnNames: ["authorId"],
        referencedTableName: "authors",
        referencedColumnNames: ["id"],
        onDelete: "RESTRICT",
        onUpdate: "CASCADE",
      }),
    );

    await queryRunner.createForeignKey(
      "books",
      new TableForeignKey({
        name: "FK_books_genre",
        columnNames: ["genreId"],
        referencedTableName: "genres",
        referencedColumnNames: ["id"],
        onDelete: "RESTRICT",
        onUpdate: "CASCADE",
      }),
    );

    await queryRunner.createForeignKey(
      "books",
      new TableForeignKey({
        name: "FK_books_shelf",
        columnNames: ["shelfId"],
        referencedTableName: "shelves",
        referencedColumnNames: ["id"],
        onDelete: "RESTRICT",
        onUpdate: "CASCADE",
      }),
    );

    await queryRunner.createForeignKey(
      "books",
      new TableForeignKey({
        name: "FK_books_saga",
        columnNames: ["sagaId"],
        referencedTableName: "sagas",
        referencedColumnNames: ["id"],
        onDelete: "SET NULL",
        onUpdate: "CASCADE",
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey("books", "FK_books_saga");
    await queryRunner.dropForeignKey("books", "FK_books_shelf");
    await queryRunner.dropForeignKey("books", "FK_books_genre");
    await queryRunner.dropForeignKey("books", "FK_books_author");
    await queryRunner.dropTable("books");
  }
}
