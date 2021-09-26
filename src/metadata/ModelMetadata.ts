import { Collection } from 'mongodb'
import { BaseMetadata } from './base/BaseMetadata'
import { FieldMetadata } from './FieldMetadata'

export class ModelMetadata extends BaseMetadata {
  /**
   * If not provided the name of the collection
   * will be the same name of the class
   */
  name: string

  fields: FieldMetadata[]

  collection: Collection
}
