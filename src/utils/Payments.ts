import { PaymentMethod, PaymentMethods } from '@/api/interfaces'

export const getPaymentMethodName = (paymentMethod: PaymentMethod) => {
  switch (paymentMethod) {
  case PaymentMethods.CASH:
    return 'Efectivo'
  case PaymentMethods.CARD:
    return 'Tarjeta'
  case PaymentMethods.TRANSFER:
    return 'Transferencia'
  case PaymentMethods.OTHER:
    return 'Otro'
  }
}

export const getSaleStatusName = (status: string | undefined) => {
  if (!status) return 'Ninguno'
  switch (status) {
  case 'pending':
    return 'Pendiente de pago'
  case 'partially_paid':
    return 'Parcialmente pagado'
  case 'paid':
    return 'Pagado'
  case 'rejected':
    return 'Rechazado'
  case 'deleted':
    return 'Eliminado'
  case 'refunded':
    return 'Reembolsado'
  default:
    return 'Pendiente de pago'
  }
}

export const parseAmount = (amount: number | string | null | undefined) => {
  if (amount === null || amount === undefined) return 0
  if (typeof amount === 'string' && amount.trim() === '') return 0
  return parseFloat(amount.toString())
}

export const fixedAmount = (amount: number) => {
  return Number(amount.toFixed(2))
}