import { StartSessionParams } from './auth'
import { Configuration } from './configuration'
import { User, Seller } from './users'
import { Product, ProductCart, UnitMeasurement, Category } from './products'

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
  Category,
  ProductCart,
  Configuration, 
  UnitMeasurement,
  StartSessionParams,
}
