<template>
  <div class="overflow-hidden">
    <header class="w-full h-[65px] px-8 bg-white border-b border-gray-200 flex items-center justify-between">
      <h1 class="text-2xl text-black-2 font-medium">
        Inventarios
      </h1>
      <div class="flex items-center gap-4">
        <select
          v-model="activeFilter"
          class="select select-bordered select-sm bg-white-1 border-white-3 w-[160px]"
        >
          <option value="all">Todos</option>
          <option value="pending">Pendientes</option>
          <option value="started">En curso</option>
          <option value="completed">Realizados</option>
          <option value="cancelled">Cancelados</option>
        </select>
        <button
          class="btn btn-sm bg-brand-orange text-white shadow-none hover:bg-brand-pink hover:border-brand-pink"
          @click="$router.push('/main/inventory/create')"
        >
          <IconPlus class="w-4 h-4" />
          Nuevo inventario
        </button>
        <label class="input bg-white-1 border border-white-3 input-sm flex items-center gap-2">
          <input
            v-model="search"
            type="text"
            class="grow"
            placeholder="Buscar inventario..."
          >
          <IconSearch class="w-4 h-4 text-black-2" />
        </label>
      </div>
    </header>

    <div class="overflow-auto h-table">
      <table class="table table-sm bg-white rounded-none">
        <thead>
          <tr>
            <th class="w-12" />
            <th>Sucursal</th>
            <th>Productos</th>
            <th>Diferencia</th>
            <th>Fecha</th>
            <th>Notas</th>
            <th>Inicio</th>
            <th>Cierre</th>
            <th>Estado</th>
            <th />
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(inventory, i) in filteredInventories"
            :key="`inventory-row-${inventory.id}`"
            :class="i % 2 === 0 ? 'bg-table-row' : 'bg-white'"
          >
            <td>
              <span class="text-sm text-black-3">{{ i + 1 }}</span>
            </td>
            <td>{{ inventory.branch_name || 'Sucursal actual' }}</td>
            <td>{{ inventory.items_count || 0 }}</td>
            <td :class="(inventory.total_difference || 0) === 0 ? 'text-black-1' : 'text-brand-pink'">
              {{ formatDifference(inventory.total_difference || 0) }}
            </td>
            <td>{{ formatDateShort(inventory.date || inventory.created_at) }}</td>
            <td class="max-w-[240px]">
              <p class="text-sm text-black-2 whitespace-pre-line break-words">
                {{ getInventoryNotesText(inventory) }}
              </p>
              <button
                v-if="shouldShowNotesToggle(inventory)"
                type="button"
                class="btn btn-ghost btn-xs h-auto min-h-0 p-0 text-brand-blue hover:bg-transparent"
                @click="toggleNotes(inventory.id)"
              >
                {{ isNotesExpanded(inventory.id) ? 'Mostrar menos' : 'Mostrar más' }}
              </button>
            </td>
            <td>{{ inventory.seller_init_name || '-' }}</td>
            <td>{{ inventory.seller_end_name || '-' }}</td>
            <td>
              <div
                class="badge font-medium border-none"
                :class="getInventoryStatusBadge(inventory.status).class"
              >
                {{ getInventoryStatusBadge(inventory.status).text }}
              </div>
            </td>
            <td>
              <div class="dropdown dropdown-left">
                <div
                  tabindex="0"
                  role="button"
                  class="btn w-8 h-8 btn-xs rounded-full aspect-square grid place-items-center cursor-pointer"
                >
                  <IconDotsVertical class="w-4 h-4" />
                </div>
                <ul
                  tabindex="0"
                  class="dropdown-content menu bg-base-100 text-brand-black rounded-box z-[1] w-52 p-2 shadow"
                >
                  <li @click.stop="goToInventoryDetails(inventory.id)">
                    <a>
                      <IconClipboardList class="w-4 h-4" />
                      Ver inventario
                    </a>
                  </li>
                  <li v-if="inventory.status !== 'completed' && inventory.status !== 'cancelled'" @click.stop="openCancelInventoryModal(inventory)">
                    <a class="text-brand-pink">
                      <IconCancel class="w-4 h-4" />
                      Cancelar inventario
                    </a>
                  </li>
                </ul>
              </div>
            </td>
          </tr>
          <tr v-if="filteredInventories.length === 0">
            <td colspan="10" class="text-center text-black-3 py-8">
              No hay inventarios para mostrar
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <dialog id="dialogCancelInventory" ref="dialogCancelInventoryRef" class="modal">
      <div class="modal-box">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-bold">
            Cancelar inventario
          </h3>
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
              :disabled="isCancellingInventory"
              @click="handleSubmitCancelInventory"
            >
              <span v-if="isCancellingInventory" class="loading loading-spinner loading-sm" />
              {{ isCancellingInventory ? 'Cancelando...' : 'Sí, cancelar' }}
            </button>
          </div>
        </div>
      </div>
    </dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  IconCancel,
  IconClipboardList,
  IconDotsVertical,
  IconPlus,
  IconSearch,
} from '@tabler/icons-vue'
import { cancelInventory } from '@/api/electron'
import type { Inventory, Response } from '@/api/interfaces'
import { toast } from '@/composables/useToast'
import { useDate } from '@/composables/useDate'
import { useRouter } from 'vue-router'
import { getInventoryStatusBadge } from '@/utils/Inventories'
import { useInventory } from '@/composables/useInventory'

type InventoryFilter = 'all' | 'pending' | 'started' | 'completed' | 'cancelled'

const router = useRouter()
const { inventories, refreshInventories } = useInventory()
const { formatDateShort } = useDate()

const search = ref('')
const activeFilter = ref<InventoryFilter>('all')
const expandedNotes = ref<string[]>([])
const notesPreviewLength = 80

const filteredInventories = computed(() => {
  return inventories.value.filter((inventory) => {
    const matchesStatus = activeFilter.value === 'all'
      || (activeFilter.value === 'pending' && ['draft', 'pending'].includes(inventory.status))
      || inventory.status === activeFilter.value
    const term = search.value.trim().toLowerCase()
    const matchesSearch = !term
      || inventory.notes?.toLowerCase().includes(term)
      || inventory.branch_name?.toLowerCase().includes(term)
      || getInventoryStatusBadge(inventory.status).text.toLowerCase().includes(term)

    return matchesStatus && matchesSearch
  })
})

const formatDifference = (difference: number) => {
  if (difference === 0) return '0'
  return difference > 0 ? `+${difference}` : `${difference}`
}

const getInventoryNotes = (inventory: Inventory) => inventory.notes?.trim() || ''

const shouldShowNotesToggle = (inventory: Inventory) => {
  return getInventoryNotes(inventory).length > notesPreviewLength
}

const isNotesExpanded = (inventoryId: string) => {
  return expandedNotes.value.includes(inventoryId)
}

const getInventoryNotesText = (inventory: Inventory) => {
  const notes = getInventoryNotes(inventory)
  if (!notes) return '-'
  if (isNotesExpanded(inventory.id) || notes.length <= notesPreviewLength) return notes
  return `${notes.slice(0, notesPreviewLength)}...`
}

const toggleNotes = (inventoryId: string) => {
  if (isNotesExpanded(inventoryId)) {
    expandedNotes.value = expandedNotes.value.filter((id) => id !== inventoryId)
    return
  }
  expandedNotes.value.push(inventoryId)
}

const loadInventories = () => {
  refreshInventories().then((response) => {
    if (!response.success) {
      toast.error(response.message)
    }
  })
}

const goToInventoryDetails = (inventoryId: string) => {
  router.push({ name: 'InventoryDetailView', params: { id: inventoryId } })
}

const dialogCancelInventoryRef = ref()
const selectedInventoryCancel = ref<Inventory | null>(null)
const isCancellingInventory = ref(false)

const openCancelInventoryModal = (inventory: Inventory) => {
  selectedInventoryCancel.value = inventory
  dialogCancelInventoryRef.value?.showModal()
}

const closeCancelInventoryModal = () => {
  dialogCancelInventoryRef.value?.close()
  selectedInventoryCancel.value = null
}

const handleSubmitCancelInventory = () => {
  if (isCancellingInventory.value) return
  if (!selectedInventoryCancel.value) return

  isCancellingInventory.value = true
  cancelInventory(selectedInventoryCancel.value.id, (response: Response<{ id: string }>) => {
    isCancellingInventory.value = false
    if (!response.success) {
      toast.error(response.message)
      return
    }
    toast.success('Inventario cancelado exitosamente')
    closeCancelInventoryModal()
    loadInventories()
  })
}
</script>
