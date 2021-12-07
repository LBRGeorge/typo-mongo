import { FindOneOptions as MongoFindOneOptions } from 'mongodb'

export interface FindOptions<T> extends MongoFindOneOptions<T extends T ? T : T> {
  populate?: [keyof Partial<T>] | string[]
}