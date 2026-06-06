import type { CreateEntity, Timestamp, UUID, UpdateEntity } from './common.js'

export type ConfigurationMode = 'offline' | 'business'

export interface Configuration {
  id: UUID
  configured: boolean
  token: string | null
  mode: ConfigurationMode
  default_printer: string | null
  enable_sync: boolean
  last_sync: Timestamp | null
}

export type CreateConfiguration = CreateEntity<Configuration, 'id'>
export type UpdateConfiguration = UpdateEntity<Configuration, 'id'>
