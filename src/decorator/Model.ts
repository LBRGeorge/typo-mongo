import { ModelOptions } from '../interfaces/ModelOptions'
import { getMetadataStorage } from '../metadata-args/MetadataArgsStorage'
import { ModelMetadata } from '../metadata/ModelMetadata'

export function Model(options?: ModelOptions) {
  return function (target: any): void {
    const targetName = target.prototype.constructor.name

    const modelMetadata = new ModelMetadata()
    modelMetadata.target = target
    modelMetadata.targetName = targetName
    modelMetadata.name = options && options.name ? options.name : targetName

    getMetadataStorage().modelMetadata.push(modelMetadata)
  }
}