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