import type { CreateEntity, Timestamp, UUID, UpdateEntity } from './common.js'

export type CashMovementType = 'income' | 'withdraw'

export interface CashMovement {
  id: UUID
  id_cash_register: UUID
  id_seller: UUID
  amount: number
  type: CashMovementType
  reason: string
  description: string | null
  created_at: Timestamp
  synced_at: Timestamp | null
}

export type CreateCashMovement = CreateEntity<CashMovement, 'id' | 'created_at' | 'synced_at'>
export type UpdateCashMovement = UpdateEntity<CashMovement>
