import mongoose, { ConnectOptions, Schema } from 'mongoose'
/**
 * @description - Caso 1 uma url de conexão usando collections como tenants 
 * 
 * @todo -> url do mongodb
 * @todo -> options de conexão do mongodb
 * @todo -> schema principal que gerencia os tentants
 * @todo -> um schema ou schemas que o tentant precisar carregar para aquela conexão
 * @todo -> carregar na memoria a conexão com mongo
 */

/**
 * @description - Caso 2 mult urls de conexão cada uma suas collections separadas 
 * 
 * @todo -> url do mongodb
 * @todo -> options de conexão do mongodb
 * @todo -> schema principal que gerencia os tentants
 * @todo -> um schema ou schemas que o tentant precisar carregar para aquela conexão
 * @todo -> carregar na memoria a conexão com mongo
 */


interface ITenantConnection {
  registerModel(name: string,schema: Schema, collection?: string, options?: mongoose.CompileModelOptions): void
  getConnection(tenantId: string): mongoose.Connection
}

interface BasicMongooseConnection {
  createConnection(): Promise<mongoose.Connection>
  closeConnection(force: boolean): void
}

export class MongooseConnection implements BasicMongooseConnection {
  protected readonly mongodbUrl: string
  protected readonly connectionOptions: mongoose.ConnectOptions
  
  protected connection = mongoose.connection
  
  constructor(mongodbUrl: string, connectionOptions: ConnectOptions) {
    this.mongodbUrl = mongodbUrl
    this.connectionOptions = connectionOptions
  }

  async createConnection () {
    this.connection = await mongoose.createConnection(this.mongodbUrl, this.connectionOptions)
    return this.connection
  }

  closeConnection(force: boolean): void {
    this.connection.close(force)
  }
}

export class TenantConnection implements ITenantConnection {
  protected readonly connection: mongoose.Connection

  constructor (connection: mongoose.Connection) {
    this.connection = connection
  }
  
  registerModel(name: string, schema: Schema, collection?: string, options?: mongoose.CompileModelOptions): void {
    if (!this.connection.models[name]) {
      this.connection.model(name, schema, collection, options)
    }
  }

  getConnection(tenantId: string): mongoose.Connection {
    return this.connection.useDb(tenantId, { useCache: true })
  }

}

const a = new MongooseConnection('', {})