import { ModelOptions } from '../interfaces/ModelOptions'
import { getMetadataStorage } from '../metadata-args/MetadataArgsStorage'
import { ModelMetadata } from '../metadata/ModelMetadata'
import { RepositoryMetadata } from '../metadata/RepositoryMetadata'
import { BaseRepository } from '../repository/BaseRepository'

export function Repository(model: any) {
  return function (target: any): void {
    const targetName = target.prototype.constructor.name
    const modelMetadata = getMetadataStorage().modelMetadata.find(v => v.target === model)

    if (modelMetadata) {
      const repositoryMetadata = new RepositoryMetadata()
      repositoryMetadata.target = target
      repositoryMetadata.targetName = targetName
      repositoryMetadata.modelMetadata = modelMetadata

      getMetadataStorage().repositoryMetadata.push(repositoryMetadata)
    }
  }
}