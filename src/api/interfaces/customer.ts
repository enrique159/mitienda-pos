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
  payment_due_date: string | null
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
  payment_due_date?: string | Date
}

export interface UpdateCustomer {
  id: string
  name?: string
  rfc?: string
  email?: string
  phone?: string
  address?: string
  status?: Customer['status']
}

export interface UpdateCustomerCredit {
  id: string
  has_credit: boolean
  credit_limit: number
  payment_due_date: string | null
}
