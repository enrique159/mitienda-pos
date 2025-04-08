export interface CashMovement {
  id: string
  id_cash_register: string
  amount: number
  type: 'income' | 'outcome'
  reason: string
  description?: string
  created_at: string
  synced_at?: string
}

export interface CreateCashMovement extends Omit<CashMovement, 'id' | 'created_at' | 'synced_at'> {}