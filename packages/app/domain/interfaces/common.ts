import type { UUID } from '../../shared/types.js'

export type { UUID }

export type Timestamp = string | Date
export type Nullable<T> = T | null
export type JsonColumn<T> = T | string

export type ActiveStatus = 'active' | 'inactive'

export type CreateEntity<T, Generated extends PropertyKey = 'id' | 'created_at' | 'updated_at' | 'synced_at'> = Omit<
  T,
  Extract<Generated, keyof T>
>

export type UpdateEntity<T, Locked extends PropertyKey = 'id' | 'created_at'> = Partial<
  Omit<T, Extract<Locked, keyof T>>
>
