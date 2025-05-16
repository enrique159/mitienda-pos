<template>
  <div class="overflow-auto h-table">
    <table class="table table-sm bg-white rounded-none">
      <!-- head -->
      <thead>
        <tr>
          <th class="w-12" />
          <th>Proveedor</th>
          <th>Creado por</th>
          <th>Estado</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(purchaseOrder, i) in filteredPurchaseOrders" :key="`purchase-order-row-${purchaseOrder.id}`" :class="i % 2 === 0 ? 'bg-table-row' : 'bg-white'">
          <td>
            <span class="text-sm text-black-3">{{ i + 1 }}</span>
          </td>
          <td>{{ purchaseOrder.provider_name }}</td>
          <td>{{ purchaseOrder.seller_name }}</td>
          <td>
            <div
              class="badge font-medium border-none"
              :class="[purchaseOrder.status === PurchaseOrderStatus.SENT ? 'text-green-500 bg-success/20' : 'text-black-3 bg-white-2']"
            >
              {{ purchaseOrder.status === PurchaseOrderStatus.SENT ? 'Enviado' : 'Pendiente' }}
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts" setup>
import { useVuelidate } from '@vuelidate/core'
import { required, helpers } from '@vuelidate/validators'
import { ref, reactive, computed } from 'vue'
import { useProduct } from '@/composables/useProduct'
import { IconDotsVertical, IconEdit, IconTrash } from '@tabler/icons-vue'
import { PurchaseOrder, Response } from '@/api/interfaces'
import { getPurchaseOrders } from '@/api/electron'
import { toast } from 'vue3-toastify'
import { usePurchaseOrder } from '@/composables/usePurchaseOrder'
import { PurchaseOrderStatus } from '@/api/interfaces/purchase_orders'

const { purchaseOrders, setPurchaseOrders } = usePurchaseOrder()

const props = defineProps<{
  search: String
}>()

const filteredPurchaseOrders = computed(() => {
  return purchaseOrders.value
})

const getAllPurchaseOrders = () => {
  getPurchaseOrders((response: Response<PurchaseOrder[]>) => {
    if (!response.success) {
      toast.error(response.message)
      return
    }
    setPurchaseOrders(response.response)
  })
}

getAllPurchaseOrders()
</script>