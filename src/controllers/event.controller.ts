import { Request, Response } from "express";
import { DatabaseRepository } from "../declarations";
import dotenv from "dotenv";
import { Event } from "src/entities";
dotenv.config();

export class EventController {
  constructor(private userRepository: DatabaseRepository<Event>) {}

}
