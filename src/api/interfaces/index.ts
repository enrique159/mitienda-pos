import { StartSessionParams } from './auth'
import { Configuration } from './configuration'
import { User, Seller } from './users'
import { Product, ProductCart } from './products'

interface Response<T> {
  success: boolean
  message: string
  response: T
}

export type {
  User,
  Seller,
  Product,
  Response,
  ProductCart,
  Configuration, 
  StartSessionParams,
}
