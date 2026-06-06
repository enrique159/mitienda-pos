import type { UUID } from './types'

export interface Provider {
  id: UUID
  id_company: UUID
  name: string
  contact_name?: string
  email?: string
  phone?: string
  address?: string
  website?: string
  tax_id?: string
  notes?: string
  status: 'active' | 'inactive'
  created_at: Date
  updated_at: Date
  synced_at?: Date
}

export type CreateProvider = Omit<Provider, 'id' | 'status' | 'created_at' | 'updated_at' | 'synced_at'>
export type UpdateProvider = Partial<Provider> & Pick<Provider, 'id'>
