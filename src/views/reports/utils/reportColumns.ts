import { useCurrency } from '@/composables/useCurrency'

const dateValue = (value: string) => value ? new Date(value).toLocaleDateString('es-MX') : ''
const boolValue = (value: boolean) => value ? 'Si' : 'No'
const saleStatus = (value: string) => ({
  pending: 'Pendiente',
  partially_paid: 'Pago parcial',
  paid: 'Pagada',
  rejected: 'Rechazada',
  deleted: 'Eliminada',
  refunded: 'Reembolsada',
}[value] || value)

const purchaseStatus = (value: string) => ({
  draft: 'Borrador',
  sent: 'Enviada',
  received: 'Recibida',
  completed: 'Completada',
  cancelled: 'Cancelada',
  has_issues: 'Con incidencias',
}[value] || value)

const inventoryStatus = (value: string) => ({
  draft: 'Borrador',
  pending: 'Pendiente',
  started: 'Iniciado',
  completed: 'Completado',
  cancelled: 'Cancelado',
}[value] || value)

const cashRecordType = (value: string) => ({
  audit: 'Corte',
  movement: 'Movimiento',
}[value] || value)

const cashMovementType = (value: string) => ({
  income: 'Ingreso',
  withdraw: 'Retiro',
}[value] || value || '')

export const useReportColumns = () => {
  const { formatCurrency } = useCurrency()

  const money = (value: number | null | undefined) => value === null || value === undefined ? '' : formatCurrency(value || 0)

  return {
    sales: [
      { key: 'folio', label: 'Folio' },
      { key: 'created_at', label: 'Fecha', format: dateValue },
      { key: 'customer_name', label: 'Cliente' },
      { key: 'seller_name', label: 'Vendedor' },
      { key: 'branch_name', label: 'Sucursal' },
      { key: 'total', label: 'Total', format: money },
      { key: 'balance_due', label: 'Pendiente', format: money },
      { key: 'status', label: 'Estado', format: saleStatus },
    ],
    products: [
      { key: 'product_name', label: 'Producto' },
      { key: 'category_name', label: 'Categoria' },
      { key: 'provider_name', label: 'Proveedor' },
      { key: 'quantity', label: 'Unidades' },
      { key: 'total', label: 'Ventas', format: money },
      { key: 'profit', label: 'Utilidad', format: money },
    ],
    cash: [
      { key: 'created_at', label: 'Fecha', format: dateValue },
      { key: 'record_type', label: 'Registro', format: cashRecordType },
      { key: 'movement_type', label: 'Movimiento', format: cashMovementType },
      { key: 'seller_name', label: 'Vendedor' },
      { key: 'amount', label: 'Movimiento', format: money },
      { key: 'total_amount', label: 'Total corte', format: money },
      { key: 'balance', label: 'Balance', format: money },
      { key: 'difference', label: 'Diferencia', format: money },
      { key: 'reason', label: 'Motivo' },
    ],
    credits: [
      { key: 'folio', label: 'Folio' },
      { key: 'created_at', label: 'Fecha', format: dateValue },
      { key: 'customer_name', label: 'Cliente' },
      { key: 'seller_name', label: 'Vendedor' },
      { key: 'total', label: 'Total', format: money },
      { key: 'amount_paid', label: 'Pagado', format: money },
      { key: 'balance_due', label: 'Pendiente', format: money },
      { key: 'due_date', label: 'Vence', format: dateValue },
      { key: 'status', label: 'Estado', format: saleStatus },
    ],
    inventory: [
      { key: 'sku', label: 'SKU' },
      { key: 'name', label: 'Producto' },
      { key: 'category_name', label: 'Categoria' },
      { key: 'provider_name', label: 'Proveedor' },
      { key: 'stock', label: 'Existencia' },
      { key: 'stock_minimum', label: 'Minimo' },
      { key: 'unlimited_stock', label: 'Sin limite', format: boolValue },
      { key: 'selling_price', label: 'Precio', format: money },
    ],
    inventoryAudits: [
      { key: 'created_at', label: 'Fecha', format: dateValue },
      { key: 'status', label: 'Estado', format: inventoryStatus },
      { key: 'supervisor_name', label: 'Supervisor' },
      { key: 'items_count', label: 'Productos' },
      { key: 'registered_quantity', label: 'Registrado' },
      { key: 'counted_quantity', label: 'Contado' },
    ],
    purchases: [
      { key: 'created_at', label: 'Fecha', format: dateValue },
      { key: 'provider_name', label: 'Proveedor' },
      { key: 'seller_name', label: 'Vendedor' },
      { key: 'status', label: 'Estado', format: purchaseStatus },
      { key: 'ordered_quantity', label: 'Pedido' },
      { key: 'received_quantity', label: 'Recibido' },
      { key: 'received_at', label: 'Recepcion', format: dateValue },
    ],
  }
}
