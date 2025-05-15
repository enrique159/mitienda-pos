import { ref } from "vue"
import { defineStore } from "pinia"
import { PurchaseOrder } from "@/api/interfaces"

export const usePurchaseOrderStore = defineStore('purchaseOrder', () => {
  const purchaseOrders = ref<PurchaseOrder[]>([])

  const setPurchaseOrders = (newPurchaseOrders: PurchaseOrder[]) => {
    purchaseOrders.value = newPurchaseOrders
  }

  return {
    purchaseOrders,
    setPurchaseOrders,
  }
})