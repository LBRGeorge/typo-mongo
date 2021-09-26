import { FieldType } from '../types/FieldType'
import { BaseMetadata } from './base/BaseMetadata'
import { ModelMetadata } from './ModelMetadata'

export class FieldMetadata extends BaseMetadata {
  /**
   * Model which this field belongs to
   */
  modelMetadata: ModelMetadata

  /**
   * Type of the field
   */
  type: FieldType
  
  /**
   * Model which is been referred here
   */
  referenceMetadata: ModelMetadata
  
  /**
   * Is this field an id?
   */
  isId: boolean

  refModel: any
  propertyName: string


  public getReferenceField() {
    if (!this.referenceMetadata) return null

    return this.referenceMetadata.fields.find(v => v.isId) || null
  }
}
