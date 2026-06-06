import type { ActiveStatus, CreateEntity, JsonColumn, Timestamp, UUID, UpdateEntity } from './common.js'

export type UnitMeasurement = 'piece' | 'kg' | 'g' | 'liter' | 'ml' | 'box' | 'other'

export interface ProductTax {
  code: string
  identifier?: string
  name?: string
  type: string
  value: number | null
  fixed?: number
}

export interface Product {
  id: UUID
  id_company: UUID
  id_category: UUID
  id_provider: UUID
  name: string
  sku: string
  barcode: string | null
  description: string | null
  unit_measurement: UnitMeasurement
  is_bulk: boolean
  unlimited_stock: boolean
  stock: number | null
  stock_minimum: number | null
  purchase_price: number | null
  selling_price: number
  taxes: JsonColumn<ProductTax[]>
  is_active: boolean
  has_expiration_date: boolean
  expiration_date: Timestamp | null
  requires_quantity: boolean
  is_composite: boolean
  status: ActiveStatus
  created_at: Timestamp
  updated_at: Timestamp
  synced_at: Timestamp | null
}

export type CreateProduct = CreateEntity<Product, 'id' | 'created_at' | 'updated_at' | 'synced_at'>
export type UpdateProduct = UpdateEntity<Product>
