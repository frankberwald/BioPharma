import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, OneToMany, JoinColumn } from "typeorm";
import { Branch } from "./Branch";
import { Movements } from "./Movements";

@Entity("products")
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 255 })
  name: string;

  @Column({ type: "int" })
  amount: number;

  @Column({ type: "varchar", length: 200 })
  description: string;

  @Column({ type: "varchar", length: 200 })
  url_cover: string;

  @Column({ type: "uuid" })
  branch_id: string;

  @OneToMany(() => Movements, (movement) => movement.product)
  movements: Movements[];

  @ManyToOne(() => Branch, (branch) => branch.products, { onDelete: "CASCADE" })
  @JoinColumn({ name: "branch_id" })
  branch: Branch;

  @CreateDateColumn({ type: "timestamp" })
  created_at: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updated_at: Date;
}