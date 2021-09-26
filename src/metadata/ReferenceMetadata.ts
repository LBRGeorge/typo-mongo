import { BaseMetadata } from './base/BaseMetadata'
import { FieldMetadata } from './FieldMetadata'
import { ModelMetadata } from './ModelMetadata'

export class ReferenceMetadata extends BaseMetadata {
  /**
   * Model which this reference belongs to
   */
  modelMetadata: ModelMetadata

  /**
   * Model which is been referred here
   */
  referenceMetadata: ModelMetadata

  /**
   * Field which this reference is been declared
   */
  fieldMetadata: FieldMetadata

  refModel: any

  propertyName: string
}
