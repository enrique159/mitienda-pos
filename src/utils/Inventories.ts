import { InventoryStatus } from '@/api/interfaces'

export const getInventoryStatusBadge = (
  status: InventoryStatus | undefined | null
) => {
  if (!status)
    return {
      text: 'Sin estado',
      class: 'bg-slate-500/10 text-slate-500',
    }

  switch (status) {
    case 'draft':
      return {
        text: 'Borrador',
        class: 'bg-black-2/10 text-black-2',
      }
    case 'pending':
      return {
        text: 'Pendiente',
        class: 'bg-gray-600/10 text-gray-600',
      }
    case 'started':
      return {
        text: 'En curso',
        class: 'bg-info/10 text-info',
      }
    case 'completed':
      return {
        text: 'Realizado',
        class: 'bg-green-500/10 text-green-500',
      }
    case 'cancelled':
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
