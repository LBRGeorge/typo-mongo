import { ModelMetadata } from '../metadata/ModelMetadata'
import { FindOptions } from '../interfaces/FindOptions'
import { BaseRepository } from '../repository/BaseRepository'
import { FieldMetadata } from '../metadata/FieldMetadata'

const POPULATED_KEYS: string[] = []

export const normalizeFindResult = async <T>(baseMetadata: ModelMetadata, result: T, options?: FindOptions<T>): Promise<T> => {
  if (options.populate) {
    for await (const prop of options.populate) {
      const nested = prop.toString().split('.')

      result = await nestedPopulate<T>(baseMetadata, result, nested)
    }

    // Clear populated keys
    POPULATED_KEYS.splice(0, POPULATED_KEYS.length)
  }

  return result
}

const nestedPopulate = async <T>(baseMetadata: ModelMetadata, result: T, nestedItems: string[]): Promise<T> => {
  const field = nestedItems[0]
  nestedItems.splice(0, 1)

  // Get current metadata
  const fieldMetadata = baseMetadata.fields.find(v => v.propertyName === field)

  if (result[field] && fieldMetadata && fieldMetadata.getReferenceField()) {
    const populateKey = [baseMetadata.targetName, field].join('_')

    if (!POPULATED_KEYS.includes(populateKey)) {
      result = await populate<T>(fieldMetadata, result, field)
      
      // Set this field as already populated, so we will not repopulate on this current operation
      POPULATED_KEYS.push(populateKey)
    }

    if (nestedItems.length > 0) {
      // We should pass the next model to find the reference
      result[field] = await nestedPopulate(fieldMetadata.getReferenceField().modelMetadata, result[field], nestedItems)
    }
  }

  return result
}

const populate = async <T>(metadata: FieldMetadata, result: T, field: string): Promise<T> => {
  const ref = metadata.getReferenceField()
  const model = ref.target

  const repo = new BaseRepository<typeof model>()

  // We should declare the metadata, because we do not know who we will dealing with
  // So we already have the references where and we just need to declare them and our repository will work
  repo.metadata = ref.modelMetadata
  repo.collection = ref.modelMetadata.collection

  let referred = null

  if (result[field] instanceof Array) {
    const query: any = {
      [ref.propertyName]: {
        $in: result[field]
      }
    }
    referred = await repo.find(query)
  } else {
    const query: any = {
      [ref.propertyName]: result[field]
    }
    referred = await repo.findOne(query)
  }

  if (referred) {
    result[field] = referred
  }

  return result
}