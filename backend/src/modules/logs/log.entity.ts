import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from "typeorm";

@Entity("logs")
export class Log {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 20 })
  level!: string; // INFO, WARN, ERROR, DEBUG

  @Column({ type: "varchar", length: 255 })
  event!: string; // HTTP_REQUEST, LOGIN_SUCCESS, LOGIN_FAILED, CRUD_CREATE, etc.

  @Column({ type: "text" })
  message!: string;

  @Column({ type: "varchar", length: 50, nullable: true })
  method!: string | null;

  @Column({ type: "varchar", length: 255, nullable: true })
  path!: string | null;

  @Column({ type: "int", nullable: true })
  statusCode!: string | number | null;

  @Column({ type: "int", nullable: true })
  responseTime!: number | null; // en milisegundos

  @Column({ type: "text", nullable: true })
  metadata!: string | null; // JSON stringified para datos adicionales

  @CreateDateColumn({ type: "timestamp" })
  createdAt!: Date;
}
