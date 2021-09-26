import { FieldMetadata } from '../metadata/FieldMetadata'
import { ReferenceMetadata } from '../metadata/ReferenceMetadata'
import { ModelMetadata } from '../metadata/ModelMetadata'
import { RepositoryMetadata } from '../metadata/RepositoryMetadata'

class MetadataStorage {
  public readonly modelMetadata: ModelMetadata[] = []
  public readonly fieldMetadata: FieldMetadata[] = []
  public readonly referenceMetadata: ReferenceMetadata[] = []
  public readonly repositoryMetadata: RepositoryMetadata[] = []
}

export const getMetadataStorage = (): MetadataStorage => {
  if (!(global as any).typomongoMetadataStorage) {
    (global as any).typomongoMetadataStorage = new MetadataStorage()
  }

  return (global as any).typomongoMetadataStorage
}

