<template>
  <div class="p-8 pt-4 h-full w-full max-w-[1080px] mx-auto space-y-4">
    <header class="flex justify-between items-center gap-2">
      <div class="flex items-center gap-2">
        <button class="btn btn-sm btn-ghost btn-circle" @click="$router.back()">
          <IconArrowLeft size="24" />
        </button>
        <h6 class="text-2xl font-bold">
          Detalles del pedido
        </h6>
        <span class="badge badge-lg" :class="getPurchaseOrderStatusBadge(purchaseOrder?.status).class">
          {{ getPurchaseOrderStatusBadge(purchaseOrder?.status).text }}
        </span>
      </div>

      <button
        class="px-4 py-2 text-sm font-medium text-white bg-brand-orange rounded-md hover:bg-brand-pink flex items-center gap-2"
        @click="openChangeStatusModal(purchaseOrder)"
      >
        <IconProgressAlert size="18" />
        Cambiar estado
      </button>
    </header>
    <section id="order-details" class="grid grid-cols-4 gap-4">
      <div>
        <p class="text-sm text-black-3">
          Proveedor:
        </p>
        <p class="font-medium">
          {{ purchaseOrder?.provider_name }}
        </p>
      </div>
      <div>
        <p class="text-sm text-black-3">
          Creado por:
        </p>
        <p class="font-medium">
          {{ purchaseOrder?.seller_name }}
        </p>
      </div>
      <div>
        <p class="text-sm text-black-3">
          Fecha de pedido:
        </p>
        <p class="font-medium">
          {{ formatDatetime(purchaseOrder?.ordered_at || undefined) }}
        </p>
      </div>
      <div>
        <p class="text-sm text-black-3">
          Fecha de recepción:
        </p>
        <p class="font-medium">
          {{ formatDatetime(purchaseOrder?.received_at || undefined) }}
        </p>
      </div>

      <!-- SECOND ROW -->
      <div class="collapse bg-white col-span-4">
        <input type="checkbox" v-model="isAdditionalInfoOpen">
        <div class="collapse-title font-medium flex justify-between items-center pr-6">
          <p class="inline-flex items-center gap-2">
            <IconInfoCircle size="24" class="text-brand-blue" />
            Información adicional
          </p>
          <IconChevronDown size="24" class="transition-transform duration-300" :class="{ 'rotate-180': isAdditionalInfoOpen }" />
        </div>
        <div class="collapse-content grid grid-cols-2 gap-4">
          <div>
            <p class="text-sm text-black-3">
              Fecha de creación:
            </p>
            <p class="font-medium">
              {{ formatDatetime(purchaseOrder?.created_at || undefined) }}
            </p>
          </div>
          <div>
            <p class="text-sm text-black-3">
              Fecha de actualización:
            </p>
            <p class="font-medium">
              {{ formatDatetime(purchaseOrder?.updated_at || undefined) }}
            </p>
          </div>
          <div class="col-span-2">
            <div class="flex items-center gap-2">
              <span class="text-sm text-black-3">
                Notas:
              </span>
              <div class="tooltip tooltip-right" data-tip="Editar notas">
                <button class="btn btn-ghost btn-sm btn-circle" @click="editPurchaseOrderNotes">
                  <IconEdit size="21" />
                </button>
              </div>
            </div>
            <div v-if="isEditingNotes" class="space-y-2">
              <fieldset>
                <textarea
                  v-model="newNotes"
                  class="textarea textarea-bordered w-full"
                  placeholder="Notas adicionales"
                  maxlength="255"
                  rows="3"
                />
              </fieldset>
              <div class="flex justify-end gap-4">
                <base-button
                  @click="closeEditingNotes"
                >
                  Cancelar
                </base-button>
                <base-button button-type="secondary" @click="saveNotes">
                  Guardar
                </base-button>
              </div>
            </div>
            <p v-else class="font-medium text-sm text-black-2">
              {{ purchaseOrder?.notes || 'Ninguna' }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <section id="order-items" class="space-y-4">
      <table class="table table-sm bg-white rounded-lg">
        <thead>
          <tr>
            <th>Artículo</th>
            <th>Solicitado</th>
            <th class="w-20">
              Recibido
            </th>
            <th>Incidecia</th>
            <th>Notas</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in purchaseOrderProducts" :key="`product-row-${item.id}`">
            <td>{{ item.product?.name }}</td>
            <td>{{ item.quantity_ordered }}</td>
            <td>
              <input
                type="number"
                v-model.number="item.quantity_received"
                @keydown="validateOnlyNumbers"
                class="input input-sm input-bordered no-arrows w-20"
              >
            </td>
            <td>
              <select
                v-model="item.incidence"
                class="select select-sm select-bordered w-full"
                :class="{ 'text-black-3': !item.incidence }"
              >
                <option value="">
                  Sin problemas
                </option>
                <option
                  v-for="option in PurchaseOrderItemIncidenceOptions"
                  :key="`select-option-${option.value}`"
                  :value="option.value"
                >
                  {{ option.label }}
                </option>
              </select>
            </td>
            <td>
              <input
                type="text"
                class="input input-sm input-bordered"
                v-model="item.note"
              >
            </td>
          </tr>
        </tbody>
      </table>

      <div class="flex justify-end gap-2">
        <base-button @click="resetPurchaseOrderProducts">
          Cancelar
        </base-button>
        <base-button
          button-type="secondary"
          class="flex items-center gap-2"
          @click="handleSaveChanges"
        >
          <IconDeviceDesktopDown size="18" />
          Guardar cambios
        </base-button>
      </div>
    </section>
  </div>


  <!-- DIALOG CHANGE STATUS -->
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
        <select
          class="select select-bordered w-full max-w-xs"
          v-model="newStatus"
        >
          <option
            v-for="option in PURCHASE_ORDER_OPTIONS"
            :key="option.value"
            :value="option.value"
          >
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

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { IconProgressAlert, IconChevronDown, IconInfoCircle, IconDeviceDesktopDown, IconEdit } from '@tabler/icons-vue'
import { IconArrowLeft } from '@tabler/icons-vue'
import { usePurchaseOrder } from '@/composables/usePurchaseOrder'
import { getPurchaseOrderStatusBadge } from '@/utils/PurchaseOrders'
import { PurchaseOrder, PurchaseOrderItem, PurchaseOrderStatus } from '@/api/interfaces/purchase_orders'
import { updatePurchaseOrder, updatePurchaseOrderItems, updatePurchaseOrderStatus } from '@/api/electron'
import { PurchaseOrderItemIncidenceOptions } from '@/api/interfaces/purchase_orders'
import { useProduct } from '@/composables/useProduct'
import { useDate } from '@/composables/useDate'
import { useRoute } from 'vue-router'
import { Product, Response } from '@/api/interfaces'
import { validateOnlyNumbers } from '@/utils/InputValidators'
import { toast } from 'vue3-toastify'

const route = useRoute()
const isAdditionalInfoOpen = ref(false)

const { formatDatetime } = useDate()
const { purchaseOrders } = usePurchaseOrder()
const { products } = useProduct()

let originalPurchaseOrderProducts: Array<PurchaseOrderItem & { product: Product | null }> = []
const purchaseOrderProducts = ref<Array<PurchaseOrderItem & { product: Product | null }>>([])
const purchaseOrder = ref<PurchaseOrder | null>(null)


onMounted(() => {
  purchaseOrder.value = purchaseOrders.value.find(
    (purchaseOrder) => purchaseOrder.id === route.params.id
  ) || null
  purchaseOrderProducts.value = purchaseOrder.value?.items?.map((item: PurchaseOrderItem) => {
    const foundProduct = products.value.find((product) => product.id === item.id_product)
    return {
      ...item,
      product: foundProduct || null,
      incidence: item.incidence || '',
      note: item.note || '',
    }
  }) || []

  originalPurchaseOrderProducts = JSON.parse(JSON.stringify(purchaseOrderProducts.value))
})

const resetPurchaseOrderProducts = () => {
  purchaseOrderProducts.value = [...originalPurchaseOrderProducts]
}

// CHANGE STATUS
// CHANGE STATUS
const dialogChangeStatusRef = ref()
const newStatus = ref<PurchaseOrderStatus | null>(null)
const PURCHASE_ORDER_OPTIONS = [
  { value: PurchaseOrderStatus.DRAFT, label: 'Borrador' },
  { value: PurchaseOrderStatus.SENT, label: 'Enviado' },
  { value: PurchaseOrderStatus.RECEIVED, label: 'Recibido' },
  { value: PurchaseOrderStatus.COMPLETED, label: 'Completado' },
  { value: PurchaseOrderStatus.HAS_ISSUES, label: 'Con problemas' },
  { value: PurchaseOrderStatus.CANCELLED, label: 'Cancelado' },
]

const openChangeStatusModal = (purchaseOrder: PurchaseOrder | null) => {
  if (!purchaseOrder) return
  newStatus.value = purchaseOrder.status
  dialogChangeStatusRef.value?.showModal()
}

const closeChangeStatusModal = () => {
  dialogChangeStatusRef.value?.close()
}

const handleSubmitChangeStatus = () => {
  if (!purchaseOrder.value || !newStatus.value) return
  updatePurchaseOrderStatus(
    { id: purchaseOrder.value.id, status: newStatus.value },
    (response: Response<PurchaseOrder>) => {
      if (!response.success) {
        toast.error(response.message)
        return
      }
      purchaseOrder.value!.status = newStatus.value!
      toast.success('Estado actualizado exitosamente')
      closeChangeStatusModal()
    }
  )
}

// NOTES
const isEditingNotes = ref(false)
const newNotes = ref('')

const editPurchaseOrderNotes = () => {
  isEditingNotes.value = !isEditingNotes.value
  if (isEditingNotes.value) {
    newNotes.value = purchaseOrder.value?.notes || ''
  }
}

const saveNotes = () => {
  if (!purchaseOrder.value) return
  const purchaseOrderData = {
    id: purchaseOrder.value.id,
    purchaseOrder: {
      notes: newNotes.value,
    },
  }
  updatePurchaseOrder(purchaseOrderData, (response: Response<PurchaseOrder>) => {
    if (!response.success) {
      toast.error(response.message)
      return
    }
    toast.success('Notas actualizadas correctamente')
    purchaseOrder.value!.notes = newNotes.value
    closeEditingNotes()
  })
}

const closeEditingNotes = () => {
  isEditingNotes.value = false
  newNotes.value = ''
}

const handleSaveChanges = () => {
  if (!purchaseOrder.value) return
  const purchaseOrderItemsData = purchaseOrderProducts.value.map((item: PurchaseOrderItem) => {
    return {
      id: item.id,
      id_purchase_order: item.id_purchase_order,
      quantity_received: item.quantity_received,
      incidence: item.incidence,
      note: item.note,
    }
  })
  updatePurchaseOrderItems(purchaseOrderItemsData, (response: Response<PurchaseOrderItem[]>) => {
    if (!response.success) {
      toast.error(response.message)
      return
    }
    originalPurchaseOrderProducts = JSON.parse(JSON.stringify(purchaseOrderProducts.value))
    toast.success('Pedido actualizado correctamente')
  })
}
</script>