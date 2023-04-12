import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Event } from "./event.entity";

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("text", { unique: true, nullable: true })
  email: string;

  @Column("text")
  password: string;

  @OneToMany(() => Event, (event) => event.user)
    events: Event[];

}
