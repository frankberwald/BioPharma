import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm"
import { Branch } from "./Branch"
import { Drivers } from "./Drivers"

export enum UserProfile {
  DRIVER = "DRIVER",
  BRANCH = "BRANCH",
  ADMIN = "ADMIN"
}

@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: "varchar", length: "255", nullable: false })
  name: string

  @Column({ type: "enum", enum: UserProfile })
  profile: UserProfile

  @Column({ type: "varchar", length: "150", nullable: false, unique: true })
  email: string

  @Column({ type: "varchar", length: "150", nullable: false })
  password_hash: string

  @Column({ type: "boolean", default: true })
  status: boolean

  @OneToMany(() => Branch, (branch) => branch.user, { cascade: true })
  branches: Branch[];

  @OneToMany(() => Drivers, (driver) => driver.user)
  drivers: Drivers[]

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at: Date;

  @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
  updated_at: Date;

}