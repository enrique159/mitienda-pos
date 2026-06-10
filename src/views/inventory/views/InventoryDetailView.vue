<template>
  <div
    class="p-8 pt-4 h-full w-full max-w-[1080px] mx-auto space-y-4 overflow-y-auto"
  >
    <header class="flex justify-between items-center gap-2">
      <div class="flex items-center gap-2">
        <button class="btn btn-sm btn-ghost btn-circle" @click="$router.back()">
          <IconArrowLeft size="24" />
        </button>
        <h6 class="text-2xl font-bold">Detalles del inventario</h6>
        <span
          v-if="inventory"
          class="badge badge-lg"
          :class="getInventoryStatusBadge(inventory.status).class"
        >
          {{ getInventoryStatusBadge(inventory.status).text }}
        </span>
      </div>

      <div class="flex items-center gap-2">
        <button
          v-if="canStart"
          class="px-4 py-2 text-sm font-medium text-white bg-info rounded-md hover:bg-brand-blue flex items-center gap-2"
          :disabled="!!actionLoading"
          @click="startCurrentInventory"
        >
          <IconPlayerPlay size="18" />
          Iniciar
        </button>
        <button
          v-if="canApprove"
          class="px-4 py-2 text-sm font-medium text-white bg-brand-orange rounded-md hover:bg-brand-pink flex items-center gap-2"
          :disabled="!!actionLoading"
          @click="openApproveInventoryModal"
        >
          <IconCircleCheck size="18" />
          Aprobar inventario
        </button>
      </div>
    </header>

    <section id="inventory-details" class="grid grid-cols-4 gap-4">
      <div>
        <p class="text-sm text-black-3">Sucursal:</p>
        <p class="font-medium">
          {{ inventory?.branch_name || 'Sucursal actual' }}
        </p>
      </div>
      <div>
        <p class="text-sm text-black-3">Productos:</p>
        <p class="font-medium">
          {{ localItems.length }}
        </p>
      </div>
      <div>
        <p class="text-sm text-black-3">Con diferencia:</p>
        <p class="font-medium">
          {{ itemsWithDifference }}
        </p>
      </div>
      <div>
        <p class="text-sm text-black-3">Diferencia total:</p>
        <p
          class="font-medium"
          :class="totalDifference === 0 ? 'text-black-1' : 'text-brand-pink'"
        >
          {{ formatDifference(totalDifference) }}
        </p>
      </div>

      <div>
        <p class="text-sm text-black-3">Iniciado por:</p>
        <p class="font-medium">
          {{ inventory?.seller_init_name || '-' }}
        </p>
      </div>
      <div>
        <p class="text-sm text-black-3">Cerrado por:</p>
        <p class="font-medium">
          {{ inventory?.seller_end_name || '-' }}
        </p>
      </div>
      <div>
        <p class="text-sm text-black-3">Fecha de inicio:</p>
        <p class="font-medium">
          {{ formatDatetimeShort(inventory?.started_at || undefined) || '-' }}
        </p>
      </div>
      <div>
        <p class="text-sm text-black-3">Fecha de cierre:</p>
        <p class="font-medium">
          {{ formatDatetimeShort(inventory?.ended_at || undefined) || '-' }}
        </p>
      </div>

      <div class="collapse bg-white col-span-4">
        <input v-model="isAdditionalInfoOpen" type="checkbox" />
        <div
          class="collapse-title font-medium flex justify-between items-center pr-6"
        >
          <p class="inline-flex items-center gap-2">
            <IconInfoCircle size="24" class="text-brand-blue" />
            Información adicional
          </p>
          <IconChevronDown
            size="24"
            class="transition-transform duration-300"
            :class="{ 'rotate-180': isAdditionalInfoOpen }"
          />
        </div>
        <div class="collapse-content grid grid-cols-2 gap-4">
          <div>
            <p class="text-sm text-black-3">Fecha de creación:</p>
            <p class="font-medium">
              {{ formatDatetimeShort(inventory?.created_at || undefined) }}
            </p>
          </div>
          <div>
            <p class="text-sm text-black-3">Fecha de actualización:</p>
            <p class="font-medium">
              {{ formatDatetimeShort(inventory?.updated_at || undefined) }}
            </p>
          </div>
          <div class="col-span-2">
            <span class="text-sm text-black-3">Notas:</span>
            <p class="font-medium text-sm text-black-2">
              {{ inventory?.notes || 'Ninguna' }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <section id="inventory-items" class="space-y-4 pb-12">
      <div class="bg-white rounded-xl">
        <div class="p-4 flex justify-end items-center gap-4">
          <label
            class="input bg-white-1 border border-white-3 input-sm flex items-center gap-2"
          >
            <input
              v-model="search"
              type="text"
              class="grow"
              placeholder="Buscar producto..."
            />
            <IconSearch class="w-4 h-4 text-black-2" />
          </label>
        </div>
      </div>

      <table class="table table-sm bg-white rounded-lg">
        <thead>
          <tr>
            <th>Artículo</th>
            <th>SKU</th>
            <th>Sistema</th>
            <th class="w-24">Conteo</th>
            <th>Diferencia</th>
            <th>Incidencia</th>
            <th>Notas</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="item in filteredItems"
            :key="`inventory-item-row-${item.id}`"
          >
            <td>
              <p>{{ item.product_name }}</p>
              <p class="text-xs text-black-3">
                {{ item.product_barcode || 'Sin código' }}
              </p>
            </td>
            <td>{{ item.product_sku || '-' }}</td>
            <td>{{ item.registered_quantity }}</td>
            <td>
              <input
                v-model.number="item.counted_quantity"
                type="number"
                min="0"
                :disabled="!canEdit"
                class="input input-sm input-bordered no-arrows w-24"
                @keydown="validateOnlyNumbers"
              />
            </td>
            <td
              :class="
                itemDifference(item) === 0 ? 'text-black-1' : 'text-brand-pink'
              "
            >
              {{ formatDifference(itemDifference(item)) }}
            </td>
            <td>
              <div
                class="badge font-medium border-none"
                :class="getIncidenceBadge(itemDifference(item)).class"
              >
                {{ getIncidenceBadge(itemDifference(item)).text }}
              </div>
            </td>
            <td>
              <input
                v-model="item.note"
                type="text"
                :disabled="!canEdit"
                class="input input-sm input-bordered"
              />
            </td>
          </tr>
          <tr v-if="!loading && filteredItems.length === 0">
            <td colspan="7" class="text-center text-black-3 py-8">
              No hay productos para mostrar
            </td>
          </tr>
          <tr v-if="loading">
            <td colspan="7" class="text-center text-black-3 py-8">
              Cargando inventario...
            </td>
          </tr>
        </tbody>
      </table>

      <div class="flex justify-between gap-2">
        <button
          v-if="canCancel"
          class="btn btn-ghost text-brand-pink"
          :disabled="!!actionLoading"
          @click="openCancelInventoryModal"
        >
          Cancelar inventario
        </button>
        <span v-else />
        <div class="flex justify-end gap-2">
          <base-button v-if="canEdit" @click="resetInventoryItems">
            Descartar cambios
          </base-button>
          <base-button
            v-if="canEdit"
            button-type="secondary"
            class="flex items-center gap-2"
            :disabled="!!actionLoading"
            @click="saveInventoryItems()"
          >
            <IconDeviceDesktopDown size="18" />
            Guardar cambios
          </base-button>
        </div>
      </div>
    </section>

    <dialog
      id="dialogApproveInventory"
      ref="dialogApproveInventoryRef"
      class="modal"
    >
      <div class="modal-box">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-bold">Aprobar inventario</h3>
          <div class="modal-action mt-0">
            <form method="dialog" @submit="closeApproveInventoryModal">
              <button class="close-btn">
                Cerrar
                <CustomKbd>ESC</CustomKbd>
              </button>
            </form>
          </div>
        </div>
        <div class="flex flex-col items-center gap-4">
          <p class="text-black-1 font-medium text-center text-lg mb-4">
            Al aprobar se reajustará el stock de los productos. ¿Deseas
            continuar?
          </p>
          <div class="grid grid-cols-2 gap-4 w-full">
            <button
              class="btn btn-ghost btn-outline border-white-3 hover:bg-white-3 hover:border-white-3 hover:text-brand-black"
              @click="closeApproveInventoryModal"
            >
              No, regresar
            </button>
            <button
              class="btn bg-brand-orange hover:bg-brand-pink text-white"
              :disabled="actionLoading === 'approve'"
              @click="approveCurrentInventory"
            >
              <span
                v-if="actionLoading === 'approve'"
                class="loading loading-spinner loading-sm"
              />
              {{ actionLoading === 'approve' ? 'Aprobando...' : 'Sí, aprobar' }}
            </button>
          </div>
        </div>
      </div>
    </dialog>

    <dialog
      id="dialogCancelInventory"
      ref="dialogCancelInventoryRef"
      class="modal"
    >
      <div class="modal-box">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-bold">Cancelar inventario</h3>
          <div class="modal-action mt-0">
            <form method="dialog" @submit="closeCancelInventoryModal">
              <button class="close-btn">
                Cerrar
                <CustomKbd>ESC</CustomKbd>
              </button>
            </form>
          </div>
        </div>
        <div class="flex flex-col items-center gap-4">
          <p class="text-black-1 font-medium text-center text-lg mb-4">
            ¿Estás seguro de cancelar el inventario?
          </p>
          <div class="grid grid-cols-2 gap-4 w-full">
            <button
              class="btn btn-ghost btn-outline border-white-3 hover:bg-white-3 hover:border-white-3 hover:text-brand-black"
              @click="closeCancelInventoryModal"
            >
              No, regresar
            </button>
            <button
              class="btn bg-brand-pink hover:bg-brand-orange text-white"
              :disabled="actionLoading === 'cancel'"
              @click="cancelCurrentInventory"
            >
              <span
                v-if="actionLoading === 'cancel'"
                class="loading loading-spinner loading-sm"
              />
              {{
                actionLoading === 'cancel' ? 'Cancelando...' : 'Sí, cancelar'
              }}
            </button>
          </div>
        </div>
      </div>
    </dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  IconArrowLeft,
  IconChevronDown,
  IconCircleCheck,
  IconDeviceDesktopDown,
  IconInfoCircle,
  IconPlayerPlay,
  IconSearch,
} from '@tabler/icons-vue'
import {
  approveInventory,
  cancelInventory,
  getInventoryById,
  startInventory,
  updateInventoryItems,
} from '@/api/electron'
import type {
  Inventory,
  InventoryItem,
  Response,
  UpdateInventoryItem,
} from '@/api/interfaces'
import { useUser } from '@/composables/useUser'
import { toast } from '@/composables/useToast'
import { useDate } from '@/composables/useDate'
import { getInventoryStatusBadge } from '@/utils/Inventories'
import { validateOnlyNumbers } from '@/utils/InputValidators'
import { useInventory } from '@/composables/useInventory'

const route = useRoute()
const router = useRouter()
const { setCurrentInventory, refreshInventories } = useInventory()
const { user } = useUser()
const { formatDatetimeShort } = useDate()

const inventory = ref<Inventory | null>(null)
const localItems = ref<InventoryItem[]>([])
const originalItems = ref<InventoryItem[]>([])
const loading = ref(false)
const actionLoading = ref<string | null>(null)
const search = ref('')
const isAdditionalInfoOpen = ref(false)
const dialogApproveInventoryRef = ref()
const dialogCancelInventoryRef = ref()

const inventoryId = computed(() => String(route.params.id))
const canEdit = computed(
  () =>
    !!inventory.value &&
    ['draft', 'pending', 'started'].includes(inventory.value.status)
)
const canStart = computed(
  () =>
    !!inventory.value && ['draft', 'pending'].includes(inventory.value.status)
)
const canApprove = computed(
  () =>
    !!inventory.value &&
    ['draft', 'pending', 'started'].includes(inventory.value.status)
)
const canCancel = computed(
  () =>
    !!inventory.value &&
    !['completed', 'cancelled'].includes(inventory.value.status)
)

const filteredItems = computed(() => {
  const term = search.value.trim().toLowerCase()
  if (!term) return localItems.value
  return localItems.value.filter((item) => {
    return (
      item.product_name?.toLowerCase().includes(term) ||
      item.product_sku?.toLowerCase().includes(term) ||
      item.product_barcode?.toLowerCase().includes(term) ||
      item.category_name?.toLowerCase().includes(term) ||
      item.provider_name?.toLowerCase().includes(term)
    )
  })
})

const itemsWithDifference = computed(
  () => localItems.value.filter((item) => itemDifference(item) !== 0).length
)
const totalDifference = computed(() =>
  localItems.value.reduce((acc, item) => acc + itemDifference(item), 0)
)

const loadInventory = () => {
  loading.value = true
  getInventoryById(
    inventoryId.value,
    (response: Response<Inventory | null>) => {
      loading.value = false
      if (!response.success || !response.response) {
        toast.error(response.message)
        router.push({ name: 'InventoriesView' })
        return
      }

      inventory.value = response.response
      setCurrentInventory(response.response)
      localItems.value = (response.response.items || []).map((item) => ({
        ...item,
      }))
      originalItems.value = (response.response.items || []).map((item) => ({
        ...item,
      }))
    }
  )
}

const buildItemsPayload = (): UpdateInventoryItem[] => {
  return localItems.value.map((item) => ({
    id: item.id,
    counted_quantity: Number(item.counted_quantity || 0),
    note: item.note || null,
  }))
}

const saveInventoryItems = (
  afterSave?: () => void,
  showSuccessToast = true
) => {
  if (!inventory.value || !canEdit.value) return
  actionLoading.value = 'save'
  updateInventoryItems(
    {
      inventoryId: inventory.value.id,
      items: buildItemsPayload(),
    },
    (response: Response<{ id: string }>) => {
      actionLoading.value = null
      if (!response.success) {
        toast.error(response.message)
        return
      }
      if (showSuccessToast) toast.success('Conteo guardado')
      if (afterSave) {
        afterSave()
        return
      }
      refreshInventories().then(loadInventory)
    }
  )
}

const resetInventoryItems = () => {
  localItems.value = originalItems.value.map((item) => ({ ...item }))
}

const startCurrentInventory = () => {
  if (!inventory.value) return
  actionLoading.value = 'start'
  startInventory(
    { id: inventory.value.id, sellerId: user.value.id },
    (response: Response<{ id: string }>) => {
      actionLoading.value = null
      if (!response.success) {
        toast.error(response.message)
        return
      }
      toast.success('Inventario iniciado')
      refreshInventories().then(loadInventory)
    }
  )
}

const openApproveInventoryModal = () =>
  dialogApproveInventoryRef.value?.showModal()
const closeApproveInventoryModal = () =>
  dialogApproveInventoryRef.value?.close()

const approveCurrentInventory = () => {
  if (!inventory.value) return

  saveInventoryItems(() => {
    actionLoading.value = 'approve'
    approveInventory(
      { id: inventoryId.value, sellerId: user.value.id },
      (response: Response<{ id: string }>) => {
        actionLoading.value = null
        if (!response.success) {
          toast.error(response.message)
          return
        }
        closeApproveInventoryModal()
        toast.success('Inventario aprobado y stock reajustado')
        refreshInventories().then(loadInventory)
      }
    )
  }, false)
}

const openCancelInventoryModal = () =>
  dialogCancelInventoryRef.value?.showModal()
const closeCancelInventoryModal = () => dialogCancelInventoryRef.value?.close()

const cancelCurrentInventory = () => {
  if (!inventory.value) return

  actionLoading.value = 'cancel'
  cancelInventory(inventory.value.id, (response: Response<{ id: string }>) => {
    actionLoading.value = null
    if (!response.success) {
      toast.error(response.message)
      return
    }
    closeCancelInventoryModal()
    toast.success('Inventario cancelado')
    refreshInventories().then(loadInventory)
  })
}

const itemDifference = (item: InventoryItem) =>
  Number(item.counted_quantity || 0) - Number(item.registered_quantity || 0)
const formatDifference = (difference: number) =>
  difference > 0 ? `+${difference}` : `${difference}`
const getIncidenceBadge = (difference: number) => {
  if (difference > 0) return { text: 'Sobrante', class: 'bg-info/10 text-info' }
  if (difference < 0)
    return { text: 'Faltante', class: 'bg-warning/10 text-warning' }
  return { text: 'Sin diferencia', class: 'bg-black-2/10 text-black-2' }
}

onMounted(loadInventory)
</script>
