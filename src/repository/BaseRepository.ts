import { Collection, CollectionInsertManyOptions, CollectionInsertOneOptions, FilterQuery, ObjectID, OptionalId, UpdateManyOptions, UpdateOneOptions, UpdateQuery } from 'mongodb'
import { getMetadataStorage, ModelMetadata } from '..'
import { normalizeFindResult } from '../helpers/normalizeFindResult'
import { normalizeObjectId } from '../helpers/normalizeObjectId'
import { FindOneOptions } from '../interfaces/FindOneOptions'

export class BaseRepository<T> {

  collection: Collection<T>
  metadata: ModelMetadata

  constructor() {
    const repositoryMetadata = getMetadataStorage().repositoryMetadata.find(v => v.target === (this as any).constructor)
    
    if (repositoryMetadata) {
      this.metadata = repositoryMetadata.modelMetadata
      this.collection = repositoryMetadata.modelMetadata.collection
    }
  }

  private preQuery(query?: any) {
    if (!query) return undefined

    // Normalize query
    Object.keys(query).forEach(key => {
      const field = this.metadata.fields.find(v => v.propertyName === key)
      if (field) {
        // Normalize ObjectID
        if (field.type() instanceof ObjectID || field.getReferenceField()) {
          query[key] = normalizeObjectId(query[key])
        }
      }
    })
  }

  private preInsert(doc: any) {
    if (doc instanceof Array) {
      doc = doc.map(v => this.preInsert(v))
    } else {
      Object.keys(doc).forEach(key => {
        const field = this.metadata.fields.find(v => v.propertyName === key)

        // This is a field with reference to another model?
        if (field && field.getReferenceField()) {
          const refField = field.getReferenceField()

          // If the referred field is a type of ObjectID, we should dealing with that
          // This avoid saving stringfied object id in the database
          if (refField.type() instanceof ObjectID) {
            doc[key] = normalizeObjectId(doc[key])
          }
        }
      })
    }

    return doc
  }

  private async postQuery(result: T | T[], options?: FindOneOptions<T>) {
    if (options) {
      if (result instanceof Array) {
  
      } else {
        result = await normalizeFindResult<T>(this.metadata, result, options)
      }
    }
  }

  public find(query?: FilterQuery<T>): Promise<T[]> {
    // Pre query
    this.preQuery(query)

    return this.collection.find(query).toArray()
  }

  public async findOne(query: FilterQuery<T>, options?: FindOneOptions<T>): Promise<T> {
    // Pre query
    this.preQuery(query)

    const result = await this.collection.findOne(query, options)

    // Post query
    await this.postQuery(result, options)

    return result
  }

  public findById(id: ObjectID | string): Promise<T> {
    const field = this.metadata.fields.find(v => v.isId)
    if (!field) return Promise.resolve(null)

    const query: any = {
      [field.propertyName]: id
    }
    return this.findOne(query)
  }

  public async insertOne(doc: OptionalId<T>, options?: CollectionInsertOneOptions): Promise<T> {
    // Pre insert
    this.preInsert(doc)

    const result = await this.collection.insertOne(doc, options)
    return result.ops[0] as T
  }

  public async insertMany(docs: OptionalId<T>[], options?: CollectionInsertManyOptions): Promise<T[]> {
    // Pre insert
    this.preInsert(docs)

    const result = await this.collection.insertMany(docs, options)
    return result.ops as T[]
  }

  public async updateOne(query: FilterQuery<T>, doc: UpdateQuery<T> | Partial<T>, options?: UpdateOneOptions): Promise<T> {
    // Pre query
    this.preQuery(query)

    const result = await this.collection.updateOne(query, doc, options)
    if (result.matchedCount === 0) return null

    return this.findOne(query)
  }

  public async updateMany(query: FilterQuery<T>, update: UpdateQuery<T> | Partial<T>, options?: UpdateManyOptions): Promise<T[]> {
    // Pre query
    this.preQuery(query)

    const result = await this.collection.updateMany(query, update, options)
    if (result.matchedCount === 0) return []

    return this.find(query)
  }
}