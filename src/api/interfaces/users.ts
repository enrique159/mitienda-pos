export interface User {
  id: string
  name: string
  pin: string
  permissions: number
  status: 'active' | 'inactive'
  created_at: string
  updated_at: string
}

export interface Seller {
  id: string
  id_company: string
  name: string
  pin: string
  permissions: number
  status: SellerStatus
  created_at: string
  updated_at: string
  synced_at?: string
}

export interface CreateSeller {
  id_company: string
  name: string
  pin: string
  permissions: number
}

export interface UpdateSeller {
  id: string
  name: string
  pin: string
  status: SellerStatus
}

export enum SellerStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  DELETED = 'deleted',
}
