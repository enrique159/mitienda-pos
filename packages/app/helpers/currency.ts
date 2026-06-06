const safeDivide = (value: number, divisor: number, decimals = 2): number => {
  const factor = Math.pow(10, decimals)
  return Math.round((value / divisor + Number.EPSILON) * factor) / factor
}

export const formatCurrency = (value: number, currency = 'MXN'): string => {
  const adjustedValue = safeDivide(value, 100)
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(adjustedValue)
}

export const formatWithoutSymbol = (value: number): string => {
  const adjustedValue = safeDivide(value, 100)
  return new Intl.NumberFormat('es-MX', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    useGrouping: true,
  }).format(adjustedValue)
}

export const formatCurrencySimple = (value: number, currency = 'MXN'): string => {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(value)
}

