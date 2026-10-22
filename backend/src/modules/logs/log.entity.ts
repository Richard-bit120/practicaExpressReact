import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('logs')
export class Log {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  level!: string;

  @Column()
  event!: string;

  @Column('text')
  message!: string;

  @CreateDateColumn()
  createdAt!: Date;
}