import { type NetworkMessage } from '@/api/network/domain/interfaces/NetworkMessage'
import { type MetaPage } from '@/api/network/domain/interfaces/FetchPage'

export interface Response<T> {
  meta?: MetaPage
  data: T
  warnings: NetworkMessage[]
  errors: NetworkMessage[]
}
