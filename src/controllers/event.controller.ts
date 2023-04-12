import { Request, Response } from "express";
import { DatabaseRepository } from "../declarations";
import dotenv from "dotenv";
import { Event, User } from "src/entities";
import TokenPayloadDto from "src/DTO/tokenPayload.dto";
import { plainToClass } from "class-transformer";
import { validate } from "class-validator";
import { EventDto } from "../DTO";
dotenv.config();

export class EventController {
  constructor(
    private userRepository: DatabaseRepository<User>,
    private eventRepository: DatabaseRepository<Event>
  ) {}

  async createEvent(req: Request & { tkn: TokenPayloadDto }, res: Response) {
    const eventDto = plainToClass(EventDto, req.body);
    const errors = await validate(eventDto);
    if (errors.length > 0) {
      return res.status(400).json(errors.map((err) => err.constraints));
    }
    const { id } = req.tkn;
    const user: User = await this.userRepository.findOf({ where: { id } });
    try {
      const newEvent: Event = await this.eventRepository.create({
        ...eventDto,
        user,
      });
      await this.eventRepository.save(newEvent);
      return res
        .status(200)
        .json({ message: "Event created", event: newEvent });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
}
