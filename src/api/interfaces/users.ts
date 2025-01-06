export interface User {
  id: string
  name: string
  pin: string
  permissions: number
  status: number
  createdAt: string
  updatedAt: string
}

export interface Seller {
  id: string
  companyId: string
  name: string
  pin: string
  permissions: number
  status: number
  createdAt: string
  updatedAt: string
}