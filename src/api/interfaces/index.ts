import { StartSessionParams } from './auth'
import { Configuration } from './configuration'
import { User, Seller } from './users'
import {
  Product,
  ProductCart,
  UnitMeasurement,
  Unit,
  Category
} from './products'
import { Branch } from './branches'
import { CashRegister } from './cashRegisters'
import {
  GeneratedFolio,
  Sale,
  SaleDetail,
  SalePayment,
  CreateSalePayload,
  SaleStatus,
  PaymentMethods,
  SalePayload,
  PaymentPayload,
  SaleDetailPayload
} from './sale'
import { Discount } from './discount'

interface Response<T> {
  success: boolean
  message: string
  response: T
}

export type {
  User,
  Unit,
  Sale,
  Seller,
  Branch,
  Product,
  Response,
  Category,
  Discount,
  SaleDetail,
  SalePayment,
  ProductCart,
  SalePayload,
  CashRegister,
  Configuration,
  GeneratedFolio,
  PaymentPayload,
  SaleDetailPayload,
  CreateSalePayload,
  StartSessionParams
}

export { UnitMeasurement, SaleStatus, PaymentMethods }
