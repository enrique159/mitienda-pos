import type { ActiveStatus, CreateEntity, Timestamp, UUID, UpdateEntity } from './common.js'

export interface AiModel {
  id: UUID
  id_company: UUID
  name: string
  model: string
  api_key: string
  status: ActiveStatus
  default: boolean
  created_at: Timestamp
  updated_at: Timestamp
  synced_at: Timestamp | null
}

export type CreateAiModel = CreateEntity<AiModel, 'id' | 'created_at' | 'updated_at' | 'synced_at'>
export type UpdateAiModel = UpdateEntity<AiModel>
