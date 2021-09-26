import { ObjectID } from 'mongodb'

export const normalizeObjectId = (data: any) => {
  if (typeof data === 'string') {
    return new ObjectID(data)
  }
  if (typeof data !== 'object') {
    throw new Error('Invalid object ID into query')
  }

  if (data instanceof Array) {
    data = data.map(v => {
      return normalizeObjectId(v)
    })
  } else {
    if (!(data instanceof ObjectID)) {
      Object.keys(data).forEach(key => {
        data[key] = normalizeObjectId(data[key])
      })
    }
  }

  return data
}