import type { ActiveStatus, CreateEntity, Timestamp, UUID, UpdateEntity } from './common.js'

export interface Customer {
  id: UUID
  id_company: UUID
  name: string
  rfc: string | null
  email: string | null
  phone: string | null
  address: string | null
  has_credit: boolean
  credit_limit: number
  payment_due_date: string | null
  status: ActiveStatus
  created_at: Timestamp
  updated_at: Timestamp
  synced_at: Timestamp | null
}

export interface CustomerWithCredit extends Customer {
  used_credit: number
}

export type CreateCustomer = CreateEntity<Customer, 'id' | 'created_at' | 'updated_at' | 'synced_at'>
export type UpdateCustomer = UpdateEntity<Customer>
