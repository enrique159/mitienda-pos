import { Seller } from "./users"

export interface CashMovement {
  id: string
  id_cash_register: string
  id_seller: string
  amount: number
  type: CashMovementType
  reason: string
  description?: string
  created_at: string
  synced_at?: string
  seller?: Seller
}

export interface CreateCashMovement extends Omit<CashMovement, 'id' | 'created_at' | 'synced_at'> {}

export enum CashMovementType {
  INCOME = 'income',
  WITHDRAW = 'withdraw',
}

export const withdrawalReasons = Object.freeze([
  { value: "change", label: "Cambio para caja" },
  { value: "expenses", label: "Gastos operativos" },
  { value: "refund", label: "Devolución a cliente" },
  { value: "other", label: "Otro" },
])

export const depositReasons = Object.freeze([
  { value: "sales", label: "Ingreso por ventas" },
  { value: "change", label: "Devolución de cambio" },
  { value: "initial", label: "Fondo inicial" },
  { value: "other", label: "Otro" },
])