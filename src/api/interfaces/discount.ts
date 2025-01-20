export interface Discount {
  id: string
  id_branch: string
  id_product: string
  id_discount_type: DiscountType
  discount_value: number
  condition_quantity: number
  start_date: Date
  end_date?: Date
  schedule?: Array<DiscountSchedule>
  created_at: Date
  updated_at: Date
  synced_at?: Date
}

export interface DiscountSchedule {
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'
  start_time: string
  end_time: string
}

export enum DiscountType {
  PERCENTAGE = 'percentage',
  FIXED = 'fixed'
}