import type { CreateEntity, JsonColumn, Timestamp, UUID, UpdateEntity } from './common.js'

export type SaleStatus = 'pending' | 'partially_paid' | 'paid' | 'rejected' | 'deleted' | 'refunded'
export type PaymentMethod = 'cash' | 'card' | 'transfer' | 'credit' | 'other'

export interface Sale {
  id: UUID
  id_company: UUID
  id_branch: UUID
  id_seller: UUID
  id_cash_register: UUID
  id_customer: UUID | null
  folio: string
  subtotal: number
  total: number
  amount_paid: number
  balance_due: number
  discount: number
  tax: number
  on_trust: boolean
  due_date: Timestamp | null
  status: SaleStatus
  customer_notes: string | null
  cancellation_reason: string | null
  is_ticket_printed: boolean
  created_at: Timestamp
  updated_at: Timestamp
  synced_at: Timestamp | null
}

export interface SaleDetailTax {
  code: string
  type: string
  value: number | null
  fixed: number
}

export interface SaleDetail {
  id: UUID
  id_sale: UUID
  id_product: UUID
  product_name: string
  quantity: number
  selling_price: number
  tax_amount: number
  taxes: JsonColumn<SaleDetailTax[]>
  discount: number
  total: number
  profit: number
  created_at: Timestamp
  synced_at: Timestamp | null
}

export interface SalePayment {
  id: UUID
  id_sale: UUID
  payment_method: PaymentMethod
  amount: number
  change: number | null
  created_at: Timestamp
  synced_at: Timestamp | null
}

export type CreateSale = CreateEntity<Sale, 'id' | 'created_at' | 'updated_at' | 'synced_at'>
export type UpdateSale = UpdateEntity<Sale>
export type CreateSaleDetail = CreateEntity<SaleDetail, 'id' | 'created_at' | 'synced_at'>
export type CreateSalePayment = CreateEntity<SalePayment, 'id' | 'created_at' | 'synced_at'>
