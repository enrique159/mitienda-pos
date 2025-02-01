import { GeneratedFolio, Sale, SaleDetail, SalePayment, CreateSalePayload, SaleStatus, PaymentMethods, SalePayload, PaymentPayload, SaleDetailPayload, PaymentMethod } from './sale'
import { Product, ProductCart, UnitMeasurement, Unit, CreateProduct } from './products'
import { CashRegister, CashRegisterState } from './cashRegisters'
import { Customer, CreateCustomer } from './customer'
import { Configuration } from './configuration'
import { StartSessionParams } from './auth'
import { Category } from './categories'
import { User, Seller } from './users'
import { Discount } from './discount'
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
  PaymentMethod,
  CreateProduct,
  Configuration,
  GeneratedFolio,
  PaymentPayload,
  CreateCustomer,
  SaleDetailPayload,
  CreateSalePayload,
  CashRegisterState,
  StartSessionParams
}

export { UnitMeasurement, SaleStatus, PaymentMethods }
