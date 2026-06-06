import type { ActiveStatus, CreateEntity, Timestamp, UUID, UpdateEntity } from './common.js'

export interface Provider {
  id: UUID
  id_company: UUID
  name: string
  contact_name: string | null
  email: string | null
  phone: string | null
  address: string | null
  website: string | null
  tax_id: string | null
  notes: string | null
  status: ActiveStatus
  created_at: Timestamp
  updated_at: Timestamp
  synced_at: Timestamp | null
}

export type CreateProvider = CreateEntity<Provider, 'id' | 'created_at' | 'updated_at' | 'synced_at'>
export type UpdateProvider = UpdateEntity<Provider>
