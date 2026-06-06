import type { ActiveStatus, CreateEntity, Timestamp, UUID, UpdateEntity } from './common.js'

export interface Category {
  id: UUID
  id_company: UUID
  id_branch: UUID
  name: string
  description: string | null
  status: ActiveStatus
  created_at: Timestamp
  updated_at: Timestamp
  synced_at: Timestamp | null
}

export type CreateCategory = CreateEntity<Category, 'id' | 'created_at' | 'updated_at' | 'synced_at'>
export type UpdateCategory = UpdateEntity<Category>
