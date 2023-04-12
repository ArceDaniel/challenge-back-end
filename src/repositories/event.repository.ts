import { Event } from "../entities";
import { DatabaseRepository, Id, Query } from "../declarations";
import database from "../config/ormconfig";

class EventRepository implements DatabaseRepository<Event> {
  constructor() {}

  async create(data: Partial<Event>, query?: Query): Promise<Event> {
    const repository = database.getRepository(Event);
    const event = repository.create(data);

    await repository.save(event);

    return event;
  }
  async save(data: Event, query?: Query): Promise<Event> {
    const repository = database.getRepository(Event);

    return await repository.save(data);
  }
  async list(query?: Query): Promise<Event[]> {
    const repository = database.getRepository(Event);

    return repository.find(query);
  }

    async findOf(query?: Query): Promise<Event> {
    const repository = database.getRepository(Event);
    return repository.findOne(query);
    
    }


  async get(id: Id, query?: Query): Promise<Event> {
    const repository = database.getRepository(Event);

    const event = await repository.findOneBy({ id: id as any });

    if (!event) {
      throw new Error("Event does not exist");
    }

    return event;
  }

  async update(id: Id, data: Event, query?: Query): Promise<Event> {
    const repository = database.getRepository(Event);

    await repository.update(id, data);

    return this.get(id, query);
  }

  async remove(id: Id, query?: Query): Promise<Event> {
    const repository = database.getRepository(Event);

    const event = await this.get(id, query);

    await repository.delete(id);

    return event;
  }
 async count(query?: Query): Promise<number> {
    const repository = database.getRepository(Event);
    return repository.count(query);
  }
}


export default EventRepository;
