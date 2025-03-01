<template>
  <div class="overflow-auto h-table">
    <table class="table table-sm bg-white rounded-none">
      <!-- head -->
      <thead>
        <tr>
          <th class="w-12" />
          <th>Descripción</th>
          <th>Descuento</th>
          <th>Unidades</th>
          <th>Fecha inicio</th>
          <th>Fecha fin</th>
          <th>Horarios</th>
          <th>Estado</th>
          <th class="w-12" />
        </tr>
      </thead>
      <tbody>
        <tr v-for="(discount, i) in filteredDiscount" :key="`discount-row-${discount.id}`" :class="i % 2 === 0 ? 'bg-table-row' : 'bg-white'">
          <td>
            <span class="text-sm text-black-3">{{ i + 1 }}</span>
          </td>
          <td>{{ discount.description }}</td>
          <td>
            {{ formatDiscountValue(discount.type, discount.value) }}
          </td>
          <td>
            {{ discount.condition_quantity ?? 'no aplica' }}
          </td>
          <td>
            {{ formatDateShort(discount.start_date) }}
          </td>
          <td>
            {{ formatDateShort(discount.end_date) }}
          </td>
          <td>
            <button
              class="btn btn-xs bg-white-2 hover:bg-white-3 text-black-2"
              @click="openShowScheduleModal(discount.schedule ?? [])"
            >
              <icon-calendar-time class="w-4 h-4" />
              Mostrar
            </button>
          </td>
          <td>
            <div
              class="badge font-medium border-none"
              :class="[discount.status === 'active' ? 'text-green-500 bg-success/20' : 'text-black-3 bg-white-2']"
            >
              {{ discount.status === 'active' ? 'activo' : 'inactivo' }}
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
                <li @click.stop="emits('attach-products-discounts', discount)">
                  <a>
                    <icon-packages class="w-4 h-4" />
                    Editar productos asociados
                  </a>
                </li>
                <li @click.stop="emits('edit-discount', discount)">
                  <a>
                    <icon-edit class="w-4 h-4" />
                    Editar descuento
                  </a>
                </li>
                <li @click.stop="() => {}">
                  <a class="text-brand-pink">
                    <icon-trash class="w-4 h-4" />
                    Eliminar descuento
                  </a>
                </li>
              </ul>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <dialog id="dialogShowSchedule" ref="dialogShowScheduleRef" class="modal" @keydown.escape="closeShowScheduleModal">
    <div class="modal-box h-fit min-w-[680px] overflow-hidden">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-bold">
          Horarios de descuento
        </h3>
        <div class="modal-action mt-0">
          <form method="dialog" @submit="closeShowScheduleModal">
            <button class="close-btn">
              Cerrar
              <CustomKbd>ESC</CustomKbd>
            </button>
          </form>
        </div>
      </div>
      <!-- SCHEDULE -->
      <div class="grid grid-cols-7 gap-1">
        <div v-for="day in days" :key="`day-schedule-${day.day}`" class="flex flex-col gap-1">
          <div
            class="text-sm text-center  font-medium py-2 rounded-md mb-2"
            :class="[selectedSchedule.find((schedule) => schedule.day === day.day) ? 'bg-brand-orange text-white' : 'bg-white-1 text-black-2']"
          >
            {{ day.label }}
          </div>

          <div v-if="selectedSchedule.find((schedule) => schedule.day === day.day)">
            <input
              type="text"
              disabled
              :value="formatTime12(selectedSchedule.find((schedule) => schedule.day === day.day)?.start_time)"
              class="w-full text-center disabled:bg-transparent"
            >
            <p class="text-center text-black-1">
              a
            </p>
            <input
              type="text"
              disabled
              :value="formatTime12(selectedSchedule.find((schedule) => schedule.day === day.day)?.end_time)"
              class="w-full text-center disabled:bg-transparent"
            >
          </div>
        </div>
      </div>
    </div>
  </dialog>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { IconPackages, IconEdit, IconTrash, IconDotsVertical, IconCalendarTime } from '@tabler/icons-vue'
import { DiscountSchedule } from '@/api/interfaces'
import { useProduct } from '@/composables/useProduct'
import { useCurrency } from '@/composables/useCurrency'
import { useDate } from '@/composables/useDate'

const { formatDateShort, formatTime12 } = useDate()
const { formatCurrency } = useCurrency()
const { discounts } = useProduct()

const props = defineProps({
  search: {
    type: String,
    default: '',
  },
})

const emits = defineEmits(['edit-discount', 'attach-products-discounts'])

const filteredDiscount = computed(() => {
  return discounts.value.filter((discount) => {
    return discount.description.toLowerCase().includes(props.search.toLowerCase())
  })
})

const formatDiscountValue = (type: string, value: number) => {
  if (type === 'percentage') {
    return `${value}%`
  }
  return formatCurrency(value)
}

// SCHEDULE DIALOG
const selectedSchedule = ref<Array<DiscountSchedule>>([])
const dialogShowScheduleRef = ref()

const openShowScheduleModal = (schedule: Array<DiscountSchedule>) => {
  selectedSchedule.value = schedule
  dialogShowScheduleRef.value.showModal()
}
const closeShowScheduleModal = () => {
  dialogShowScheduleRef.value.close()
  selectedSchedule.value = []
}

type Day = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'
const days: Array<{ day: Day, label: string }> = [
  { day: 'monday', label: 'Lunes' },
  { day: 'tuesday', label: 'Martes' },
  { day: 'wednesday', label: 'Miércoles' },
  { day: 'thursday', label: 'Jueves' },
  { day: 'friday', label: 'Viernes' },
  { day: 'saturday', label: 'Sábado' },
  { day: 'sunday', label: 'Domingo' },
]
</script>

