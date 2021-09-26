import { MongoClient } from 'mongodb'
import { ConnectionOptions } from '../interfaces/ConnectionOptions'
import { ConnectionModels } from '../types/ConnectionModels'
import { getMetadataStorage } from '..'

export class Connection {
  private client: MongoClient

  private readonly name: string
  private readonly isConnected: boolean

  constructor(readonly options: ConnectionOptions, readonly models?: ConnectionModels) {
    this.name = this.options.name || 'default'
    this.isConnected = false

    this.createConnection()
  }

  public async connect() {
    await this.client.connect()
    
    this.buildMetadata()
  }

  public getDb(name: string) {
    return this.client.db(name)
  }

  private createConnection() {
    const url = this.buildUrl()

    const options = {
      ...this.options
    }

    delete options['url']
    this.client = new MongoClient(url, options)
  }

  private buildUrl() {
    const { url, host, port } = this.options

    if (url && url.includes('mongodb://')) {
      return url
    }

    return `mongodb://${host}:${port}`
  }

  private buildMetadata() {
    if (this.models) {
      if (this.models instanceof Array) {
        this.models.forEach(v => new v())
      }
    }

    for (const model of getMetadataStorage().modelMetadata) {
      model.fields = []
      model.collection = this.client.db(this.options.database).collection(model.name)

      for (const field of getMetadataStorage().fieldMetadata) {
        // Setup model fields
        if (field.target === model.target) {
          field.modelMetadata = model
          model.fields.push(field)
        }

        // Setup model references
        if (field.refModel === model.target) {
          field.referenceMetadata = model
        }
      }
    }
  }
}
