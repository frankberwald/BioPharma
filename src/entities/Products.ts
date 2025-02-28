import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, } from "typeorm";
import { Branch } from "./Branch";

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

  @ManyToOne(() => Branch, (branch) => branch.products, { onDelete: "CASCADE" })
  branch: Branch;

  @CreateDateColumn({ type: "timestamp" })
  created_at: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updated_at: Date;
}