import { GeneratedFolio, Sale, SaleDetail, SalePayment, CreateSalePayload, SaleStatus, PaymentMethods, SalePayload, PaymentPayload, SaleDetailPayload, PaymentMethod, TaxDetail } from './sale'
import { Product, ProductCart, UnitMeasurement, Unit, CreateProduct, ProductTax } from './products'
import { Discount, CreateDiscount, UpdateDiscount, DiscountSchedule } from './discount'
import { CashMovement, CreateCashMovement } from './cashMovements'
import { CashRegister, CashRegisterState } from './cashRegisters'
import { Category, CreateCategory } from './categories'
import { Customer, CreateCustomer } from './customer'
import { Configuration } from './configuration'
import { StartSessionParams } from './auth'
import { User, Seller } from './users'
import { Branch } from './branches'
import { Tax } from './taxes'

interface Response<T> {
  success: boolean
  message: string
  response: T
}

export type {
  User,
  Tax,
  Unit,
  Sale,
  Seller,
  Branch,
  Product,
  Response,
  Category,
  Discount,
  Customer,
  TaxDetail,
  SaleDetail,
  ProductTax,
  SalePayment,
  ProductCart,
  SalePayload,
  CashRegister,
  CashMovement,
  PaymentMethod,
  CreateProduct,
  Configuration,
  CreateDiscount,
  CreateCategory,
  UpdateDiscount,
  GeneratedFolio,
  PaymentPayload,
  CreateCustomer,
  DiscountSchedule,
  SaleDetailPayload,
  CreateSalePayload,
  CashRegisterState,
  StartSessionParams,
  CreateCashMovement
}

export { UnitMeasurement, SaleStatus, PaymentMethods }
