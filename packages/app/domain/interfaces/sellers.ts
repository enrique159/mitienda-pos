import type { CreateEntity, Timestamp, UUID, UpdateEntity } from './common.js'

export type SellerStatus = 'active' | 'inactive' | 'deleted'

export interface Seller {
  id: UUID
  id_company: UUID
  name: string | null
  pin: string | null
  permissions: number | null
  status: SellerStatus
  created_at: Timestamp
  updated_at: Timestamp
  synced_at: Timestamp | null
}

export type CreateSeller = CreateEntity<Seller, 'id' | 'created_at' | 'updated_at' | 'synced_at'>
export type UpdateSeller = UpdateEntity<Seller>
