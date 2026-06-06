import type { CreateEntity, Timestamp, UUID, UpdateEntity } from './common.js'

export type TaxType = 'tasa' | 'cuota' | 'exento'

export interface Tax {
  id: UUID
  id_company: UUID
  code: string | null
  identifier: string
  name: string | null
  type: TaxType
  value: number | null
  transferred: boolean
  withheld: boolean
  created_at: Timestamp
  updated_at: Timestamp
  synced_at: Timestamp | null
}

export type CreateTax = CreateEntity<Tax, 'id' | 'created_at' | 'updated_at' | 'synced_at'>
export type UpdateTax = UpdateEntity<Tax>
