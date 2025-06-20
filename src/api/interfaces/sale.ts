import { Seller } from "./users"

export interface GeneratedFolio {
  folio: string
}

export interface Sale {
  id: string
  id_company: string
  id_branch: string
  id_seller: string
  id_cash_register: string
  id_customer?: string
  folio: string
  subtotal: number
  total: number
  amount_paid: number
  balance_due: number
  discount: number
  tax: number
  on_trust: boolean
  due_date: Date
  status: SaleStatus
  customer_notes?: string
  cancellation_reason?: string
  details: SaleDetail[]
  payments: SalePayment[]
  seller_name: string
  created_at: Date | string
  updated_at: Date | string
  synced_at?: Date | string | null
}

export interface SaleDetail {
  id: string
  id_sale: string
  id_product: string
  product_name: string
  quantity: number
  selling_price: number
  tax_amount: number
  discount: number
  total: number
  profit: number
  created_at: Date
  synced_at?: Date
}

export interface SalePayment {
  id: string
  id_sale: string
  payment_method: PaymentMethods
  amount: number
  change?: number
  created_at: Date
  synced_at?: Date
}

export enum SaleStatus {
  PENDING = 'pending',
  PARTIALLY_PAID = 'partially_paid',
  PAID = 'paid',
  REJECTED = 'rejected',
  DELETED = 'deleted',
  REFUNDED = 'refunded'
}

export enum PaymentMethods {
  CASH = 'cash',
  CARD = 'card',
  TRANSFER = 'transfer',
  OTHER = 'other'
}

export type PaymentMethod = typeof PaymentMethods[keyof typeof PaymentMethods]


// PAYLOADS

export interface CreateSalePayload {
  sale: SalePayload,
  details: Array<SaleDetailPayload>,
  payments: Array<PaymentPayload>
}

export interface SalePayload {
  id_company: string
  id_branch: string
  id_seller: string
  id_cash_register: string
  id_customer?: string
  folio: string
  subtotal: number
  total: number
  amount_paid: number
  balance_due: number
  discount: number
  tax: number
  on_trust: boolean
  due_date?: Date
  status: SaleStatus
  customer_notes?: string
  cancellation_reason?: string
  is_ticket_printed: boolean
}

export interface SaleDetailPayload {
  id_product: string
  product_name: string
  quantity: number
  selling_price: number
  tax_amount: number
  taxes: Array<TaxDetail>
  discount: number
  total: number
  profit: number
}

export interface TaxDetail {
  code: string
  type: string
  value: number | null
  fixed: number
}

export interface PaymentPayload {
  payment_method: PaymentMethods
  amount: number
  change?: number
}