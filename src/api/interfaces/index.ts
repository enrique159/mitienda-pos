// Re-export all types, interfaces and enums from modules
export * from './sale'
export * from './purchase_orders'
export * from './products'
export * from './discount'
export * from './aiModels'
export * from './cashRegisters'
export * from './cashMovements'
export * from './categories'
export * from './providers'
export * from './customer'
export * from './company'
export * from './configuration'
export * from './auth'
export * from './users'
export * from './branches'
export * from './taxes'

// Response interface
export interface Response<T> {
  success: boolean
  message: string
  response: T
}
