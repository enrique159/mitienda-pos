export interface User {
  id: string
  name: string
  pin: string
  permissions: number
  status: number
  created_at: string
  updated_at: string
}

export interface Seller {
  id: string
  id_company: string
  name: string
  pin: string | undefined
  permissions: number
  status: number
  created_at: string
  updated_at: string
}