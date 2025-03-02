import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from "typeorm"
import { User } from "./Users"
import { Product } from "./Products"
import { Movements } from "./Movements"

@Entity("branch")
export class Branch {
  @PrimaryGeneratedColumn("uuid")
  id: number

  @Column({ type: "varchar", length: "255", nullable: false })
  full_address: string

  @Column({ type: "varchar", length: "30", nullable: false })
  document: string

  @ManyToOne(() => User, user => user.id)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => Product, (product) => product.branch)
  products: Product[];

  @OneToMany(() => Movements, (movement) => movement.product)
  movements: Movements[];

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at: Date

  @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
  updated_at: Date

}