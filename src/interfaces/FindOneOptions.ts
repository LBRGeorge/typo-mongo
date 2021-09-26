import { FindOneOptions as MongoFindOneOptions } from 'mongodb'

export interface FindOneOptions<T> extends MongoFindOneOptions<T extends T ? T : T> {
  populate?: [keyof Partial<T>] | [string]
}