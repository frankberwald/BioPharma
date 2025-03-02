import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from "typeorm"
import { User } from "./Users"
import { Product } from "./Products"

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

  @OneToMany(() => Product, (product) => product.branch)
  products: Product[];

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at: Date

  @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
  updated_at: Date

}