import { PurchaseOrderStatus } from "@/api/interfaces/purchase_orders"

export const getPurchaseOrderStatusBadge = (status: PurchaseOrderStatus | undefined | null) => {
  if (!status) return {
    text: 'Sin estado',
    class: 'bg-slate-500/10 text-slate-500',
  }
  switch (status) {
  case PurchaseOrderStatus.DRAFT:
    return {
      text: 'Borrador',
      class: 'bg-black-2/10 text-black-2',
    }
  case PurchaseOrderStatus.SENT:
    return {
      text: 'Enviado',
      class: 'bg-green-500/10 text-green-500',
    }
  case PurchaseOrderStatus.RECEIVED:
    return {
      text: 'Recibido',
      class: 'bg-warning/10 text-warning',
    }
  case PurchaseOrderStatus.COMPLETED:
    return {
      text: 'Completado',
      class: 'bg-green-500/10 text-green-500',
    }
  case PurchaseOrderStatus.HAS_ISSUES:
    return {
      text: 'Con problemas',
      class: 'bg-red-500/10 text-red-500',
    }
  case PurchaseOrderStatus.CANCELLED:
    return {
      text: 'Cancelado',
      class: 'bg-red-500/10 text-red-500',
    }
  default:
    return {
      text: 'Pendiente',
      class: 'bg-info/10 text-info',
    }
  }
}