import { GeneratedFolio, Sale, SaleDetail, SalePayment, CreateSalePayload, SaleStatus, PaymentMethods, SalePayload, PaymentPayload, SaleDetailPayload, PaymentMethod, TaxDetail } from './sale'
import { PurchaseOrder, CreatePurchaseOrder, CreatePurchaseOrderItem, CreatePurchaseOrderPayload } from './purchase_orders'
import { Product, ProductCart, UnitMeasurement, Unit, CreateProduct, ProductTax } from './products'
import { Discount, CreateDiscount, UpdateDiscount, DiscountSchedule } from './discount'
import { CashRegister, CashRegisterState, Denomination } from './cashRegisters'
import { CashMovement, CreateCashMovement } from './cashMovements'
import { Category, CreateCategory } from './categories'
import { Provider, CreateProvider } from './providers'
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
  Provider,
  TaxDetail,
  SaleDetail,
  ProductTax,
  SalePayment,
  ProductCart,
  SalePayload,
  CashRegister,
  CashMovement,
  Denomination,
  PaymentMethod,
  CreateProduct,
  Configuration,
  PurchaseOrder,
  CreateDiscount,
  CreateProvider,
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
  CreateCashMovement,
  CreatePurchaseOrder,
  CreatePurchaseOrderItem,
  CreatePurchaseOrderPayload
}

export { UnitMeasurement, SaleStatus, PaymentMethods }
