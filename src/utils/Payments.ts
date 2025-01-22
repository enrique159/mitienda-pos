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
