export type Query = Record<string, any>;

export type Where = Record<string, any>;

export type Id = string | number;

export interface DatabaseRepository<T> {
  create(data: Partial<T>, query?: Query): Promise<T>;
  save(data: T, query?: Query): Promise<T>;
  list(query?: Query): Promise<T[]>;
  get(id: Id, query?: Query): Promise<T>;
  findOf(query?: Query): Promise<T>;
  count?(query?: Query): Promise<number>;
  update(id: Id, data: T, query?: Query): Promise<T>;
  remove(id: Id, query?: Query): Promise<T>;
}