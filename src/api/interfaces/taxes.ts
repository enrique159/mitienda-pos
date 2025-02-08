export interface Tax {
  id: string
  id_company: string
  code: string
  name: string
  type: 'tasa' | 'cuota' | 'exento'
  value: number | null
  transferred: boolean
  withheld: boolean
  created_at: string
  updated_at: string
  synced_at?: string
}

// TODO: Deprecated

// export interface CreateTax {
//   id_company: string
//   code: string
//   name: string
//   type: 'tasa' | 'cuota' | 'exento'
//   percentage?: number
//   import?: number
// }