import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn } from "typeorm";
import { Branch } from "./Branch";
import { Product } from "./Products";
import { Drivers } from "./Drivers";

export enum MovementStatus {
  PENDING = "PENDING",
  IN_PROGRESS = "IN_PROGRESS",
  FINISHED = "FINISHED"
}

@Entity("movements")
export class Movements {
  @PrimaryGeneratedColumn()
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

  @ManyToOne(() => Drivers, driver => driver.movements)
  @JoinColumn({ name: 'driver_id' })
  driver: Drivers;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at: Date;

  @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
  updated_at: Date;
}