import { type NetworkMessage } from '@/app/network/domain/interfaces/NetworkMessage'
import { type MetaPage } from '@/app/network/domain/interfaces/FetchPage'

export interface Response<T> {
  meta?: MetaPage
  data: T
  warnings: NetworkMessage[]
  errors: NetworkMessage[]
}
