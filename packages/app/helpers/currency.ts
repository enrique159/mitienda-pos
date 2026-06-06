// @ts-nocheck
const safeDivide = (value, divisor, decimals = 2) => {
  const factor = Math.pow(10, decimals)
  return Math.round((value / divisor + Number.EPSILON) * factor) / factor
}

exports.formatCurrency = (value, currency = 'MXN') => {
  const adjustedValue = safeDivide(value, 100)
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(adjustedValue)
}

exports.formatWithoutSymbol = (value) => {
  const adjustedValue = safeDivide(value, 100)
  return new Intl.NumberFormat('es-MX', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    useGrouping: true,
  }).format(adjustedValue)
}

exports.formatCurrencySimple = (value, currency = 'MXN') => {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(value)
}

export {}
