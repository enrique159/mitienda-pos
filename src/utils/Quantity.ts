export const formatDisplayQuantity = (quantity: number | string | null | undefined): string => {
  const parsedQuantity = Number(quantity ?? 0)

  if (!Number.isFinite(parsedQuantity)) return '0'
  if (Number.isInteger(parsedQuantity)) return parsedQuantity.toString()

  return parsedQuantity.toFixed(2).replace(/\.?0+$/, '')
}
