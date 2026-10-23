import { MigrationInterface, QueryRunner, Table, TableIndex } from "typeorm";

export class CreateLogsTable1700000000003 implements MigrationInterface {
  name = "CreateLogsTable1700000000003";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "logs",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          { name: "level", type: "varchar", length: "20" },
          { name: "event", type: "varchar", length: "255" },
          { name: "message", type: "text" },
          { name: "method", type: "varchar", length: "50", isNullable: true },
          { name: "path", type: "varchar", length: "255", isNullable: true },
          { name: "statusCode", type: "int", isNullable: true },
          { name: "responseTime", type: "int", isNullable: true },
          { name: "metadata", type: "text", isNullable: true },
          {
            name: "createdAt",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
          },
        ],
      }),
      true,
    );

    // Índices para optimizar consultas de logs
    await queryRunner.createIndex(
      "logs",
      new TableIndex({
        name: "IDX_logs_level",
        columnNames: ["level"],
      }),
    );

    await queryRunner.createIndex(
      "logs",
      new TableIndex({
        name: "IDX_logs_event",
        columnNames: ["event"],
      }),
    );

    await queryRunner.createIndex(
      "logs",
      new TableIndex({
        name: "IDX_logs_createdAt",
        columnNames: ["createdAt"],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("logs");
  }
}
