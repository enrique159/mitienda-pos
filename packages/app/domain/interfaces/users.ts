import type { CreateEntity, Timestamp, UUID, UpdateEntity } from './common.js'

export type AccountType = 'offline' | 'business'
export type UserStatus = 'active' | 'inactive'

export interface User {
  id: UUID
  name: string | null
  email: string | null
  password: string | null
  account_type: AccountType
  status: UserStatus
  created_at: Timestamp
  updated_at: Timestamp
  synced_at: Timestamp | null
}

export type CreateUser = CreateEntity<User, 'id' | 'created_at' | 'updated_at' | 'synced_at'>
export type UpdateUser = UpdateEntity<User>
