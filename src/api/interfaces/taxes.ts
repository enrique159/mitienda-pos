export interface Tax {
  id: string
  id_company: string
  code: string
  name: string
  type: 'tasa' | 'cuota' | 'exento'
  percentage?: number
  import?: number
  created_at: string
  updated_at: string
  synced_at?: string
}

export interface CreateTax {
  id_company: string
  code: string
  name: string
  type: 'tasa' | 'cuota' | 'exento'
  percentage?: number
  import?: number
}