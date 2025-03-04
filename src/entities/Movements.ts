import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn } from "typeorm";
import { Branch } from "./Branch";
import { Product } from "./Products";

export enum MovementStatus {
  PENDING = "PENDING",
  IN_PROGRESS = "IN_PROGRESS",
  FINISHED = "FINISHED"
}

@Entity("movements")
export class Movements {
  @PrimaryGeneratedColumn("uuid")
  id: number;

  @ManyToOne(() => Branch, { eager: true })
  @JoinColumn({ name: "destination_branch_id" })
  destinationBranch: Branch;

  @ManyToOne(() => Product, { eager: true })
  @JoinColumn({ name: "product_id" })
  product: Product;

  @Column({ type: "int" })
  quantity: number;

  @Column({ type: "enum", enum: MovementStatus, default: MovementStatus.PENDING })
  status: MovementStatus

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at: Date;

  @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
  updated_at: Date;
}