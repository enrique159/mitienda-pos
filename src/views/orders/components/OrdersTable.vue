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
          <td>
            {{ formatDatetimeShort(purchaseOrder.ordered_at || undefined) }}
          </td>
          <td>
            {{ formatDatetimeShort(purchaseOrder.received_at || undefined) }}
          </td>
          <td>
            <div
              class="badge font-medium border-none"
              :class="getPurchaseOrderStatusBadge(purchaseOrder.status).class"
            >
              {{ getPurchaseOrderStatusBadge(purchaseOrder.status).text }}
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
                <li @click.stop="goToOrderDetails(purchaseOrder)">
                  <a>
                    <icon-packages class="w-4 h-4" />
                    Ver detalles
                  </a>
                </li>
                <li v-if="purchaseOrder.status === PurchaseOrderStatus.DRAFT" @click.stop="goToEditDraftOrder(purchaseOrder.id)">
                  <a>
                    <icon-edit class="w-4 h-4" />
                    Editar pedido
                  </a>
                </li>
                <li @click.stop="openCancelOrderModal(purchaseOrder)">
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

  <!-- DIALOG CANCEL ORDER -->
  <dialog id="dialogCancelOrder" ref="dialogCancelOrderRef" class="modal">
    <div class="modal-box">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-bold">
          Cancelar pedido
        </h3>
        <div class="modal-action mt-0">
          <form method="dialog" @submit="closeCancelOrderModal">
            <button class="close-btn">
              Cerrar
              <CustomKbd>ESC</CustomKbd>
            </button>
          </form>
        </div>
      </div>
      <div class="flex flex-col items-center gap-4">
        <p class="text-black-1 font-medium text-center text-lg mb-4">
          ¿Estás seguro de cancelar el pedido?
        </p>
        <div class="grid grid-cols-2 gap-4 w-full">
          <button
            class="btn btn-ghost btn-outline border-white-3 hover:bg-white-3 hover:border-white-3 hover:text-brand-black"
            @click="closeCancelOrderModal"
          >
            No, regresar
          </button>
          <button
            class="btn bg-brand-pink hover:bg-brand-orange text-white"
            @click="handleSubmitCancelOrder"
          >
            Sí, cancelar
          </button>
        </div>
      </div>
    </div>
  </dialog>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import {
  IconPackages,
  IconCancel,
  IconDotsVertical,
  IconEdit
} from '@tabler/icons-vue'
import { PurchaseOrder, Response } from '@/api/interfaces'
import { getPurchaseOrders, updatePurchaseOrderStatus } from '@/api/electron'
import { usePurchaseOrder } from '@/composables/usePurchaseOrder'
import { PurchaseOrderStatus } from '@/api/interfaces/purchase_orders'
import { getPurchaseOrderStatusBadge } from '@/utils/PurchaseOrders'
import { useDate } from '@/composables/useDate'
import { toast } from 'vue3-toastify'
import { useRouter } from 'vue-router'

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

getAllPurchaseOrders()

// CANCEL ORDER
const dialogCancelOrderRef = ref()
const selectedPurchaseOrderCancel = ref<PurchaseOrder | null>(null)

const openCancelOrderModal = (purchaseOrder: PurchaseOrder) => {
  selectedPurchaseOrderCancel.value = purchaseOrder
  dialogCancelOrderRef.value?.showModal()
}

const closeCancelOrderModal = () => {
  dialogCancelOrderRef.value?.close()
  selectedPurchaseOrderCancel.value = null
}

const handleSubmitCancelOrder = () => {
  if (!selectedPurchaseOrderCancel.value) return
  updatePurchaseOrderStatus(
    {
      id: selectedPurchaseOrderCancel.value.id,
      status: PurchaseOrderStatus.CANCELLED,
    },
    (response: Response<PurchaseOrder>) => {
      if (!response.success) {
        toast.error(response.message)
        return
      }
      toast.success('Pedido cancelado exitosamente')
      closeCancelOrderModal()
      getAllPurchaseOrders()
    }
  )
}

// ORDER DETAILS
const router = useRouter()
const goToOrderDetails = (purchaseOrder: PurchaseOrder) => {
  router.push({ name: 'OrderDetailsView', params: { id: purchaseOrder.id } })
}

const goToEditDraftOrder = (purchaseOrderId: string) => {
  router.push({ name: 'EditDraftOrderView', params: { id: purchaseOrderId } })
}
</script>
