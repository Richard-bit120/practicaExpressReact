import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from "typeorm";

export enum LogLevel {
  INFO = "INFO",
  WARN = "WARN",
  ERROR = "ERROR",
}

export enum LogEvent {
  HTTP_REQUEST = "HTTP_REQUEST",
  AUTH = "AUTH",
  CRUD = "CRUD",
}

@Entity("logs")
export class Log {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar" })
  level: LogLevel;

  @Column({ type: "varchar" })
  event: LogEvent;

  @Column({ type: "text" })
  message: string;

  @Column({ type: "simple-json", nullable: true })
  metadata: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;
}
