import { getMetadataStorage } from '..'
import { ReferenceMetadata } from '../metadata/ReferenceMetadata'

export function Reference(model: any) {
  return function (target: any, propertyName: string) {
    const type = Reflect.getMetadata('design:type', target, propertyName)

    const referenceMetadata = new ReferenceMetadata()
    referenceMetadata.target = target.constructor
    referenceMetadata.propertyName = propertyName
    referenceMetadata.refModel = model

    getMetadataStorage().referenceMetadata.push(referenceMetadata)
  }
}