import type { CreateEntity, Timestamp, UUID, UpdateEntity } from './common.js'

export type DenominationType = 'coin' | 'bill'

export interface Denomination {
  denomination: number | string
  type: DenominationType
  quantity: number
}

export interface CashRegister {
  id: UUID
  id_company: UUID
  id_branch: UUID
  id_user_opening: UUID
  id_user_closing: UUID | null
  opening_amount: number
  opening_date: Timestamp
  closing_date: Timestamp | null
  synced_opening_at: Timestamp | null
  synced_closing_at: Timestamp | null
}

export type CreateCashRegister = CreateEntity<
  CashRegister,
  'id' | 'opening_date' | 'closing_date' | 'synced_opening_at' | 'synced_closing_at'
>
export type UpdateCashRegister = UpdateEntity<CashRegister, 'id' | 'opening_date'>
