export interface Customer {
  id: string
  id_company: string
  name: string
  rfc?: string
  email?: string
  phone?: string
  address?: string
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
}