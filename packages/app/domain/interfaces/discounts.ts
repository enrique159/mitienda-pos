import type { ActiveStatus, CreateEntity, JsonColumn, Timestamp, UUID, UpdateEntity } from './common.js'

export type DiscountType = 'percentage' | 'amount'
export type DiscountDay = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'

export interface DiscountSchedule {
  day: DiscountDay
  start_time: string
  end_time: string
}

export interface Discount {
  id: UUID
  id_company: UUID
  id_branch: UUID
  description: string | null
  type: DiscountType
  value: number
  condition_quantity: number | null
  discount_for_one: boolean
  start_date: Timestamp
  end_date: Timestamp | null
  schedule: JsonColumn<DiscountSchedule[]> | null
  status: ActiveStatus
  created_at: Timestamp
  updated_at: Timestamp
  synced_at: Timestamp | null
}

export interface ProductDiscount {
  id: UUID
  id_product: UUID
  id_discount: UUID
  created_at: Timestamp
}

export type CreateDiscount = CreateEntity<Discount, 'id' | 'created_at' | 'updated_at' | 'synced_at'>
export type UpdateDiscount = UpdateEntity<Discount>
export type CreateProductDiscount = CreateEntity<ProductDiscount, 'id' | 'created_at'>
