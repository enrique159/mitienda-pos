import { GeneratedFolio, Sale, SaleDetail, SalePayment, CreateSalePayload, SaleStatus, PaymentMethods, SalePayload, PaymentPayload, SaleDetailPayload } from './sale'
import { Product, ProductCart, UnitMeasurement, Unit, Category } from './products'
import { CashRegister, CashRegisterState } from './cashRegisters'
import { Configuration } from './configuration'
import { StartSessionParams } from './auth'
import { User, Seller } from './users'
import { Discount } from './discount'
import { Customer } from './customer'
import { Branch } from './branches'

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
  Customer,
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
  CashRegisterState,
  StartSessionParams
}

export { UnitMeasurement, SaleStatus, PaymentMethods }
