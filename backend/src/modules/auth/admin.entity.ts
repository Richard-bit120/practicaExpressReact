import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("admins")
export class Admin {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", unique: true, length: 50 })
  username: string;

  @Column({ type: "varchar", select: false }) // Nunca se selecciona por defecto para no exponer el hash
  password: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
