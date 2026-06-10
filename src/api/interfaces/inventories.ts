export type InventoryStatus = 'draft' | 'pending' | 'started' | 'completed' | 'cancelled'

export interface InventoryItem {
  id: string
  id_inventory: string
  id_product: string
  counted_quantity: number
  registered_quantity: number
  incidence: string
  note: string | null
  product_name?: string
  product_sku?: string
  product_barcode?: string | null
  current_stock?: number | null
  unlimited_stock?: boolean
  category_name?: string | null
  provider_name?: string | null
  created_at: string
  updated_at: string
  synced_at: string | null
}

export interface Inventory {
  id: string
  id_company: string
  id_branch: string
  id_supervisor: string | null
  date: string | null
  started_at: string | null
  ended_at: string | null
  id_seller_init: string | null
  id_seller_end: string | null
  status: InventoryStatus
  notes: string | null
  branch_name?: string | null
  seller_init_name?: string | null
  seller_end_name?: string | null
  supervisor_name?: string | null
  items?: InventoryItem[]
  items_count?: number
  counted_items?: number
  total_difference?: number
  created_at: string
  updated_at: string
  synced_at: string | null
}

export interface CreateInventory {
  id_company: string
  id_branch: string
  id_supervisor?: string | null
  id_seller_init?: string | null
  notes?: string | null
  status?: InventoryStatus
}

export interface UpdateInventoryItem {
  id: string
  counted_quantity: number
  note?: string | null
}
