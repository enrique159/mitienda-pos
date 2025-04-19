import { Denomination } from "./cashRegisters"

export interface CashRegisterAudit {
  id: string
  id_cash_register: string
  id_user: string
  cash_amount: number
  card_amount: number
  transfer_amount: number
  other_amount: number
  income: number
  withdraw: number
  total_amount: number
  balance: number
  difference: number
  cash_breakdown: Denomination[]
  card_breakdown: number
  count_sales: number
  count_movements: number
  closure: Closure
  created_at: string
  updated_at: string
  synced_at?: string
}

export enum Closure {
  Partial = 'partial',
  Full = 'full'
}

export interface CreateCashRegisterAudit {
  id_cash_register: string
  id_user: string
  cash_amount: number
  card_amount: number
  transfer_amount: number
  other_amount: number
  income: number
  withdraw: number
  total_amount: number
  balance: number
  difference: number
  cash_breakdown: Denomination[]
  card_breakdown: number
  count_sales: number
  count_movements: number
  closure: Closure
}