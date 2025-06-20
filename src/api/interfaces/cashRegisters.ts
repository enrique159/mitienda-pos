export interface CashRegister {
  id: string
  id_company: string
  id_branch: string
  id_user_opening: string
  id_user_closing?: string
  opening_amount: number
  opening_date: string
  closing_date?: string
  synced_at?: string
}

export interface CashRegisterState {
  payments: {
    cash: number
    card: number
    transfer: number
    other: number
  }
  movements: {
    income: number
    withdraw: number
  }
  opening_amount: number
  total_amount_paid: number
  total_sales_amount: number
  total_sales: number
  total_movements: number
}

export type Denomination = {
  denomination: string
  type: 'coin' | 'bill'
  quantity: number
}