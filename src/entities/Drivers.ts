import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from "typeorm"
import { User } from "./Users";
import { Movements } from "./Movements";

@Entity("drivers")
export class Drivers {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: "varchar", length: "255", nullable: false })
  name: string

  @ManyToOne(() => User, user => user.id)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => Movements, (movement) => movement.driver)
  movements: Movements[];

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at: Date;

  @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
  updated_at: Date;

  @Column({ name: "user_id", type: "int", nullable: false })
  user_id: number;
}