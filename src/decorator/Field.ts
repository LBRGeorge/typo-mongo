import { getMetadataStorage } from '../metadata-args/MetadataArgsStorage'
import { FieldOptions } from '../interfaces/FieldOptions'
import { FieldMetadata } from '../metadata/FieldMetadata'

export function Field(options?: FieldOptions) {
  return function (target: any, propertyName: string) {
    const type = Reflect.getMetadata('design:type', target, propertyName)

    const fieldMetadata = new FieldMetadata()
    fieldMetadata.target = target.constructor
    fieldMetadata.propertyName = propertyName

    if (typeof type() !== 'object') {
      fieldMetadata.type = typeof type()
    } else {
      fieldMetadata.type = type
    }

    // If the field is flagged as id or the property name is an id
    fieldMetadata.isId = options && !!options.id || ['_id', 'id'].includes(propertyName)

    if (options && options.ref) {
      fieldMetadata.refModel = options.ref
    }

    getMetadataStorage().fieldMetadata.push(fieldMetadata)
  }
}