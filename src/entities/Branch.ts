import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne } from "typeorm"
import { User } from "./Users"

@Entity("branch")
export class Branch {
  @PrimaryGeneratedColumn("uuid")
  id: number

  @Column({ type: "varchar", length: "255", nullable: false })
  full_address: string

  @Column({ type: "varchar", length: "30", nullable: false })
  document: string

  @Column({ type: "int", nullable: false })
  userId: number

  @ManyToOne(() => User, (user) => user.branches, { onDelete: "CASCADE" })
  user: User;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at: Date

  @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
  updated_at: Date

}