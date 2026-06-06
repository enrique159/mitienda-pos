import type { CreateEntity, Timestamp, UUID, UpdateEntity } from './common.js'

export type BusinessType =
  | 'convenience_store'
  | 'clothing_store'
  | 'hardware_store'
  | 'pharmacy'
  | 'restaurant'
  | 'electronics_store'
  | 'bookstore'
  | 'grocery_store'
  | 'bakery'
  | 'other'

export interface Company {
  id: UUID
  id_user: UUID
  trade_name: string
  legal_name: string
  tax_id: string
  email: string
  phone: string
  fiscal_address: string
  postal_code: number
  neighborhood: string
  municipality: string
  state: string
  country: string
  business_type: BusinessType
  business_description: string | null
  default_currency: string
  default_tax: number
  voucher_type: string
  default_payment_method: string
  default_payment_form: string
  ai_enabled: boolean
  created_at: Timestamp
  updated_at: Timestamp
  synced_at: Timestamp | null
}

export type CreateCompany = CreateEntity<Company, 'id' | 'created_at' | 'updated_at' | 'synced_at'>
export type UpdateCompany = UpdateEntity<Company>
