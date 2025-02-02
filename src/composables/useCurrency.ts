export const useCurrency = () => {
  const formatCurrency = (value: number, currency = 'MXN') => {
    const adjustedValue = value / 100
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency,
      maximumFractionDigits: 2,
    }).format(adjustedValue)
  }

  const formatWithoutSymbol = (value: number) => {
    const adjustedValue = value / 100
    return new Intl.NumberFormat('es-MX', {
      style: 'decimal',
      maximumFractionDigits: 2,
    }).format(adjustedValue)
  }

  const formatCurrencySimple = (value: number, currency = 'MXN') => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency,
      maximumFractionDigits: 2,
    }).format(value)
  }

  return {
    formatCurrency,
    formatWithoutSymbol,
    formatCurrencySimple,
  }
}