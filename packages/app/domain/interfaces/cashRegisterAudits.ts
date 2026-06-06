import type { CreateEntity, JsonColumn, Timestamp, UUID, UpdateEntity } from './common.js'
import type { Denomination } from './cashRegisters.js'

export type CashRegisterClosure = 'partial' | 'full'

export interface CashRegisterAudit {
  id: UUID
  id_cash_register: UUID
  id_user: UUID
  cash_amount: number
  card_amount: number
  transfer_amount: number
  other_amount: number
  income: number
  withdraw: number
  total_amount: number
  balance: number
  difference: number
  cash_breakdown: JsonColumn<Denomination[]> | null
  card_breakdown: number | null
  count_sales: number
  count_movements: number
  closure: CashRegisterClosure
  created_at: Timestamp
  updated_at: Timestamp
  synced_at: Timestamp | null
}

export type CreateCashRegisterAudit = CreateEntity<CashRegisterAudit, 'id' | 'created_at' | 'updated_at' | 'synced_at'>
export type UpdateCashRegisterAudit = UpdateEntity<CashRegisterAudit>
