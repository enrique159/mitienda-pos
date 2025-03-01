export interface Discount {
  id: string
  id_company: string
  id_branch: string
  description: string
  type: 'percentage' | 'amount'
  value: number
  condition_quantity?: number
  discount_for_one: boolean
  start_date: Date
  end_date?: Date
  schedule?: Array<DiscountSchedule> | null
  status: 'active' | 'inactive'
  created_at: Date
  updated_at: Date
  synced_at?: Date
}

export interface DiscountSchedule {
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'
  start_time: string
  end_time: string
}

export interface CreateDiscount {
  id_company: string
  id_branch: string
  description: string
  type: 'percentage' | 'amount'
  value: number
  condition_quantity?: number
  discount_for_one: boolean
  start_date: Date
  end_date?: Date
  schedule: Array<DiscountSchedule>
  status: 'active' | 'inactive'
}

export type UpdateDiscount = Omit<Discount, 'created_at' | 'updated_at' | 'synced_at'>