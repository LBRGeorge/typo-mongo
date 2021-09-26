export interface ConnectionOptions {
  name?: string

  // MongoDB URL connection
  url?: string

  /**
   * Per fields connection options
   */
  host?: string
  port?: number
  username?: string
  password?: string
  database?: string
  
  authSource?: string
  useNewUrlParser?: boolean
  useUnifiedTopology?: boolean
}