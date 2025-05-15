import { PurchaseOrder } from '@/api/interfaces'
import { usePurchaseOrderStore } from '@/stores/purchaseOrderStore'
import { storeToRefs } from 'pinia'

export const usePurchaseOrder = () => {
  const purchaseOrderStore = usePurchaseOrderStore()
  const { purchaseOrders } = storeToRefs(purchaseOrderStore)

  const setPurchaseOrders = (newPurchaseOrders: PurchaseOrder[]) => {
    purchaseOrderStore.setPurchaseOrders(newPurchaseOrders)
  }

  return {
    purchaseOrders,
    setPurchaseOrders,
  }
}