export interface Company {
  id: string
  id_user: string
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
  business_description?: string
  default_currency: string
  default_tax: number
  voucher_type: string
  default_payment_method: string
  default_payment_form: string
  ai_enabled: boolean
  created_at: string | Date
  updated_at: string | Date
  synced_at?: string | Date | null
}

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
