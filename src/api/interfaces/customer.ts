export interface Customer {
  id: string
  id_company: string
  name: string
  rfc?: string
  email?: string
  phone?: string
  address?: string
  has_credit: boolean
  credit_limit: number
  used_credit: number
  days_until_due: number
  status: 'active' | 'inactive'
  created_at: string
  updated_at: string
  synced_at?: string
}

export interface CreateCustomer {
  id_company: string
  name: string
  rfc?: string
  email?: string
  phone?: string
  address?: string
  has_credit?: boolean
  credit_limit?: number
  days_until_due?: number
}