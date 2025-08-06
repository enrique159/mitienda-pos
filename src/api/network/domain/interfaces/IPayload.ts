import { type IHttpSettings } from '@/app/network/domain/interfaces/IHttpSettings'

export interface IPayload<T> {
  data?: T
  headers?: IHttpSettings
  params?: IHttpSettings
  url?: string
  baseUrl?: string
  auth?: boolean
  timeout?: number
}
