<template>
  <div class="overflow-auto h-table">
    <table class="table table-sm bg-white rounded-none">
      <!-- head -->
      <thead>
        <tr>
          <th class="w-12" />
          <th>Proveedor</th>
          <th>Creado por</th>
          <th>Artículos</th>
          <th>Fecha de creación</th>
          <th>Fecha de pedido</th>
          <th>Fecha de recepción</th>
          <th>Estado</th>
          <th />
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(purchaseOrder, i) in filteredPurchaseOrders"
          :key="`purchase-order-row-${purchaseOrder.id}`"
          :class="i % 2 === 0 ? 'bg-table-row' : 'bg-white'"
        >
          <td>
            <span class="text-sm text-black-3">{{ i + 1 }}</span>
          </td>
          <td>{{ purchaseOrder.provider_name }}</td>
          <td>{{ purchaseOrder.seller_name }}</td>
          <td>{{ purchaseOrder.items?.length || 0 }}</td>
          <td>{{ formatDatetimeShort(purchaseOrder.created_at) }}</td>
          <td>{{ formatDatetimeShort(purchaseOrder.ordered_at || undefined) }}</td>
          <td>{{ formatDatetimeShort(purchaseOrder.received_at || undefined) }}</td>
          <td>
            <div
              class="badge font-medium border-none"
              :class="getStatusBadge(purchaseOrder.status).class"
            >
              {{ getStatusBadge(purchaseOrder.status).text }}
            </div>
          </td>
          <td>
            <div class="dropdown dropdown-left">
              <div
                tabindex="0"
                role="button"
                class="btn w-8 h-8 btn-xs rounded-full aspect-square grid place-items-center cursor-pointer"
              >
                <icon-dots-vertical class="w-4 h-4" />
              </div>
              <ul
                tabindex="0"
                class="dropdown-content menu bg-base-100 text-brand-black rounded-box z-[1] w-52 p-2 shadow"
              >
                <li>
                  <a>
                    <icon-packages class="w-4 h-4" />
                    Ver detalles
                  </a>
                </li>
                <li @click.stop="openChangeStatusModal(purchaseOrder)">
                  <a>
                    <icon-progress-alert class="w-4 h-4" />
                    Cambiar estado
                  </a>
                </li>
                <li>
                  <a class="text-brand-pink">
                    <icon-cancel class="w-4 h-4" />
                    Cancelar pedido
                  </a>
                </li>
              </ul>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <dialog id="dialogChangeStatus" ref="dialogChangeStatusRef" class="modal">
    <div class="modal-box w-[320px]">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-bold">
          Cambiar estado
        </h3>
        <div class="modal-action mt-0">
          <form method="dialog" @submit="closeChangeStatusModal">
            <button class="close-btn">
              Cerrar
              <CustomKbd>ESC</CustomKbd>
            </button>
          </form>
        </div>
      </div>

      <div class="flex items-center justify-center mb-8">
        <select class="select select-bordered w-full max-w-xs" v-model="newStatus">
          <option v-for="option in PURCHASE_ORDER_OPTIONS" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </select>
      </div>

      <!-- BUTTONS -->
      <div class="flex justify-center space-x-4 w-full">
        <base-button
          type="button"
          class="w-full"
          @click="closeChangeStatusModal"
        >
          Cancelar
        </base-button>
        <button
          class="px-4 py-2 text-sm font-medium text-white bg-brand-orange rounded-md hover:bg-brand-pink w-full"
          @click="handleSubmitChangeStatus"
        >
          Cambiar
        </button>
      </div>
    </div>
  </dialog>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { IconPackages, IconCancel, IconDotsVertical, IconProgressAlert } from '@tabler/icons-vue'
import { PurchaseOrder, Response } from '@/api/interfaces'
import { getPurchaseOrders, updatePurchaseOrderStatus } from '@/api/electron'
import { usePurchaseOrder } from '@/composables/usePurchaseOrder'
import { PurchaseOrderStatus } from '@/api/interfaces/purchase_orders'
import { useDate } from '@/composables/useDate'
import { toast } from 'vue3-toastify'

const { formatDatetimeShort } = useDate()
const { purchaseOrders, setPurchaseOrders } = usePurchaseOrder()

const props = defineProps<{
  search: String
}>()

const filteredPurchaseOrders = computed(() => {
  return purchaseOrders.value.filter((purchaseOrder: PurchaseOrder) => {
    return (
      purchaseOrder.provider_name
        .toLowerCase()
        .includes(props.search.toLowerCase()) ||
      purchaseOrder.seller_name
        .toLowerCase()
        .includes(props.search.toLowerCase())
    )
  })
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

const getStatusBadge = (status: PurchaseOrderStatus) => {
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
  default:
    return {
      text: 'Pendiente',
      class: 'bg-info/10 text-info',
    }
  }
}

getAllPurchaseOrders()


// CHANGE STATUS
const dialogChangeStatusRef = ref()
const selectedPurchaseOrder = ref<PurchaseOrder | null>(null)
const newStatus = ref<PurchaseOrderStatus | null>(null)
const PURCHASE_ORDER_OPTIONS = [
  { value: PurchaseOrderStatus.DRAFT, label: 'Borrador' },
  { value: PurchaseOrderStatus.SENT, label: 'Enviado' },
  { value: PurchaseOrderStatus.RECEIVED, label: 'Recibido' },
  { value: PurchaseOrderStatus.COMPLETED, label: 'Completado' },
  { value: PurchaseOrderStatus.HAS_ISSUES, label: 'Con problemas' },
]

const openChangeStatusModal = (purchaseOrder: PurchaseOrder) => {
  selectedPurchaseOrder.value = purchaseOrder
  newStatus.value = purchaseOrder.status
  dialogChangeStatusRef.value?.showModal()
}

const closeChangeStatusModal = () => {
  dialogChangeStatusRef.value?.close()
  selectedPurchaseOrder.value = null
}

const handleSubmitChangeStatus = () => {
  if (!selectedPurchaseOrder.value || !newStatus.value) return
  updatePurchaseOrderStatus({ id: selectedPurchaseOrder.value.id, status: newStatus.value }, (response: Response<PurchaseOrder>) => {
    if (!response.success) {
      toast.error(response.message)
      return
    }
    toast.success('Estado actualizado exitosamente')
    closeChangeStatusModal()
    getAllPurchaseOrders()
  })
}
</script>
