import type { CreateEntity, Timestamp, UUID, UpdateEntity } from './common.js'

export type PurchaseOrderStatus = 'draft' | 'sent' | 'received' | 'completed' | 'cancelled' | 'has_issues'

export interface PurchaseOrder {
  id: UUID
  id_company: UUID
  id_branch: UUID
  id_provider: UUID
  id_seller: UUID
  status: PurchaseOrderStatus
  notes: string | null
  ordered_at: Timestamp | null
  received_at: Timestamp | null
  created_at: Timestamp
  updated_at: Timestamp
  synced_at: Timestamp | null
}

export interface PurchaseOrderItem {
  id: UUID
  id_purchase_order: UUID
  id_product: UUID
  quantity_ordered: number
  quantity_received: number | null
  incidence: string | null
  note: string | null
  created_at: Timestamp
  updated_at: Timestamp
  synced_at: Timestamp | null
}

export type CreatePurchaseOrder = CreateEntity<PurchaseOrder, 'id' | 'created_at' | 'updated_at' | 'synced_at'>
export type UpdatePurchaseOrder = UpdateEntity<PurchaseOrder>
export type CreatePurchaseOrderItem = CreateEntity<PurchaseOrderItem, 'id' | 'created_at' | 'updated_at' | 'synced_at'>
export type UpdatePurchaseOrderItem = UpdateEntity<PurchaseOrderItem>
