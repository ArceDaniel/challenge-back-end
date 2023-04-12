import { User } from "../entities/user.entity";
import { DatabaseRepository, Id, Query } from "../declarations";
import database from "../config/ormconfig";

class UserRepository implements DatabaseRepository<User> {
  constructor() {}

  async create(data: Partial<User>, query?: Query): Promise<User> {
    const repository = database.getRepository(User);
    const user = repository.create(data);

    await repository.save(user);

    return user;
  }
  async save(data: User, query?: Query): Promise<User> {
    const repository = database.getRepository(User);

    return await repository.save(data);
  }
  async list(query?: Query): Promise<User[]> {
    const repository = database.getRepository(User);

    return repository.find();
  }

    async findOf(query?: Query): Promise<User> {
    const repository = database.getRepository(User);
    return repository.findOne(query);
    
    }


  async get(id: Id, query?: Query): Promise<User> {
    const repository = database.getRepository(User);

    const user = await repository.findOneBy({ id: id as any });

    if (!user) {
      throw new Error("User does not exist");
    }

    return user;
  }

  async update(id: Id, data: User, query?: Query): Promise<User> {
    const repository = database.getRepository(User);

    await repository.update(id, data);

    return this.get(id, query);
  }

  async remove(id: Id, query?: Query): Promise<User> {
    const repository = database.getRepository(User);

    const user = await this.get(id, query);

    await repository.delete(id);

    return user;
  }
}

export default UserRepository;
