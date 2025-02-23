import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne } from "typeorm"
import { User } from "./Users";

@Entity("users")
export class Drivers {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: "varchar", length: "255", nullable: false })
  name: string

  @Column({ type: "uuid", nullable: false })
  user_id: string

  @ManyToOne(() => User, (user) => user.drivers, { onDelete: "CASCADE" })
  user: User;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at: Date;

  @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
  updated_at: Date;
}