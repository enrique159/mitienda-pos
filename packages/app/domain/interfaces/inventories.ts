import type { CreateEntity, Timestamp, UUID, UpdateEntity } from './common.js'

export type InventoryStatus = 'draft' | 'pending' | 'started' | 'completed' | 'cancelled'

export interface Inventory {
  id: UUID
  id_company: UUID
  id_branch: UUID
  id_supervisor: UUID | null
  date: Timestamp | null
  started_at: Timestamp | null
  ended_at: Timestamp | null
  id_seller_init: UUID | null
  id_seller_end: UUID | null
  status: InventoryStatus
  notes: string | null
  created_at: Timestamp
  updated_at: Timestamp
  synced_at: Timestamp | null
}

export interface InventoryItem {
  id: UUID
  id_inventory: UUID
  id_product: UUID
  counted_quantity: number
  registered_quantity: number
  incidence: string
  note: string | null
  created_at: Timestamp
  updated_at: Timestamp
  synced_at: Timestamp | null
}

export type CreateInventory = CreateEntity<Inventory, 'id' | 'created_at' | 'updated_at' | 'synced_at'>
export type UpdateInventory = UpdateEntity<Inventory>
export type CreateInventoryItem = CreateEntity<InventoryItem, 'id' | 'created_at' | 'updated_at' | 'synced_at'>
export type UpdateInventoryItem = UpdateEntity<InventoryItem>
