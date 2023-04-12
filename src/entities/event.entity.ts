import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class Event {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  address: string;

  @Column()
  date: Date;

  @Column({ name: "start_event", nullable: true })
  start_event: string;

  @Column({ name: "end_event", nullable: true })
  end_event: string;

  @Column({ name: "duration", nullable: true})
  duration: number;

  @ManyToOne(() => User, (user) => user.events)
  user: User;
}