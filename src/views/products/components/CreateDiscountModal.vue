<template>
  <dialog id="dialogCreateDiscount" ref="dialogCreateDiscountRef" class="modal" @keydown.escape="closeCreateDiscountModal">
    <div class="modal-box min-w-[700px] h-fit overflow-hidden">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-bold">
          Crear descuento
        </h3>
        <div class="modal-action mt-0">
          <form method="dialog" @submit="closeCreateDiscountModal">
            <button class="close-btn">
              Cerrar
              <CustomKbd>ESC</CustomKbd>
            </button>
          </form>
        </div>
      </div>

      <form @submit.prevent="handleSubmitCreate" class="w-full space-y-4">
        <!-- DESCRIPTION -->
        <label class="form-control w-full">
          <div class="label">
            <span class="label-text text-black-1 font-medium required">Descripción</span>
          </div>
          <input
            id="description"
            type="text"
            v-model="formData.description"
            placeholder="Ej. PROMO 25 Descuento..."
            class="input input-bordered w-full"
          >
          <div v-for="(error, index) in vCreate$.description.$errors" :key="`error-description-${index}`">
            <span class="text-brand-pink text-sm">{{ error.$message }}</span>
          </div>
        </label>

        <div class="grid grid-cols-2 gap-x-4">
          <!-- TYPE -->
          <label class="form-control w-full">
            <div class="label">
              <span class="label-text text-black-1 font-medium required">Tipo</span>
            </div>
            <div class="dropdown">
              <div tabindex="0" role="select" class="select select-bordered w-full flex items-center gap-2">
                {{ type }}
              </div>
              <ul tabindex="0" ref="dropdownTypeRef" class="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
                <li>
                  <a @click.stop="setType('percentage')">
                    Porcentaje
                  </a>
                </li>
                <li>
                  <a @click.stop="setType('amount')">
                    Monto fijo
                  </a>
                </li>
              </ul>
            </div>
          </label>

          <!-- VALUE -->
          <label class="form-control w-full">
            <div class="label">
              <span class="label-text text-black-1 font-medium required">Valor</span>
            </div>
            <div class="relative w-full">
              <input
                v-if="formData.type === 'percentage'"
                id="value"
                type="number"
                v-model="formData.value"
                placeholder="Ej. 25"
                min="0"
                class="input input-bordered w-full pl-7"
              >
              <span
                v-if="formData.type === 'percentage'"
                class="absolute left-3 top-1/2 transform -translate-y-1/2"
              >
                %
              </span>
            </div>
            <currency-input
              v-if="formData.type === 'amount'"
              :value="discountValue"
              :show-currency="false"
              class-name="bg-white"
              @add:value="editDiscountValue"
              @backspace="backspaceDiscountValue"
            />
            <div v-for="(error, index) in vCreate$.value.$errors" :key="`error-value-${index}`">
              <span class="text-brand-pink text-sm">{{ error.$message }}</span>
            </div>
          </label>
        </div>

        <div class="grid grid-cols-2 gap-x-4">
          <!-- CONDITION QUANTITY -->
          <label class="form-control w-full">
            <div class="label flex justify-start gap-1 items-end">
              <span class="label-text text-black-1 font-medium">
                Cantidad mínima de producto
              </span>
              <div class="tooltip" data-tip="Añade la cantidad mínima de productos que debe comprar para aplicar el descuento, si no requiere más de 1 producto, dejar en cero.">
                <icon-help-circle class="w-5 h-5 text-black-3 hover:text-black-1" />
              </div>
            </div>
            <input
              id="condition_quantity"
              type="number"
              v-model="formData.condition_quantity"
              placeholder="Ej. 5"
              min="0"
              @keydown="validateOnlyNumbers"
              class="input input-bordered w-full"
            >
            <div v-for="(error, index) in vCreate$.condition_quantity.$errors" :key="`error-condition_quantity-${index}`">
              <span class="text-brand-pink text-sm">{{ error.$message }}</span>
            </div>
          </label>

          <!-- DISCOUNT FOR ONE -->
          <div class="form-control pt-6">
            <label class="label cursor-pointer w-fit">
              <input
                type="checkbox"
                class="checkbox"
                :checked="formData.discount_for_one"
                @change="formData.discount_for_one = !formData.discount_for_one"
              >
              <div class="flex flex-col items-start ml-2">
                <span class="font-semibold text-black-1 mr-2">Descuento a una sola unidad</span>
                <span class="text-xs text-black-2">
                  Aplica el descuento a una unidad, si no, aplica el descuento a la cantidad de productos en total.
                </span>
              </div>
            </label>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-x-4">
          <!-- START DATE -->
          <div class="form-control">
            <div class="label">
              <span class="label-text text-black-1 font-medium required">Fecha de inicio</span>
            </div>
            <date-picker
              ref="inputStartDateRef"
              v-model="formData.start_date"
              :first-day-of-week="1"
              :enable-time-picker="false"
              :format="formatDate"
              :clearable="false"
              :action-row="{ showSelect: false, showCancel: false, showNow: true }"
              @date-update="selectStartDate"
              locale="es"
              input-class="input input-bordered w-full py-2"
              class="w-full"
            />
          </div>

          <!-- END DATE -->
          <div class="form-control">
            <div class="label flex justify-start gap-1 items-end">
              <span class="label-text text-black-1 font-medium">Fecha de terminación</span>
              <div class="tooltip" data-tip="Agrega una fecha de finalización para aplicar el descuento solo a ese periodo. Si no deseas aplicar un periodo de descuento, deja en blanco.">
                <icon-help-circle class="w-5 h-5 text-black-3 hover:text-black-1" />
              </div>
            </div>
            <date-picker
              ref="inputEndDateRef"
              v-model="formData.end_date"
              :first-day-of-week="1"
              :enable-time-picker="false"
              :format="formatDate"
              :action-row="{ showSelect: false, showCancel: false, showNow: true }"
              :disabled-dates="disabledDates"
              @date-update="selectEndDate"
              locale="es"
              input-class="input input-bordered w-full py-2"
              class="w-full"
            />
          </div>
        </div>

        <!-- SCHEDULE -->
        <label class="form-control w-full">
          <div class="label">
            <span class="label-text text-black-1 font-medium required">Horarios de descuento</span>
          </div>
          <base-button type="button" @click="openScheduleModal">
            Configurar horarios
          </base-button>
        </label>

        <!-- BUTTONS -->
        <div class="flex justify-end space-x-4">
          <base-button type="button" @click="closeCreateDiscountModal">
            Cancelar
          </base-button>
          <button
            type="submit"
            class="px-4 py-2 text-sm font-medium text-white bg-brand-orange rounded-md hover:bg-brand-pink"
          >
            Guardar
          </button>
        </div>
      </form>
    </div>
  </dialog>

  <dialog id="dialogSchedule" ref="dialogScheduleRef" class="modal" @keydown.escape="closeScheduleModal">
    <div class="modal-box h-fit min-w-[780px] overflow-hidden">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-bold">
          Configurar horarios
        </h3>
        <div class="modal-action mt-0">
          <form method="dialog" @submit="closeScheduleModal">
            <button class="close-btn">
              Cerrar
              <CustomKbd>ESC</CustomKbd>
            </button>
          </form>
        </div>
      </div>

      <!-- SCHEDULE -->
      <div class="flex flex-col gap-1 mb-10">
        <div
          v-for="(day, i) in days"
          :key="`button-day-schedule-${i}`"
          class="grid grid-cols-11 gap-1"
        >
          <div class="flex items-center gap-2 col-span-3">
            <label class="label cursor-pointer">
              <input
                type="checkbox"
                class="toggle toggle-success"
                :checked="discountSchedule[i].active"
                @change="toggleScheduleDay(i)"
              >
              <span class="label-text text-black-1 font-medium ml-2">
                {{ day.label }}
              </span>
            </label>
          </div>
          <input
            type="time"
            v-model="discountSchedule[i].start_time"
            class="input input-bordered w-full col-span-4"
            :disabled="!discountSchedule[i].active"
            step="3600"
          >
          <input
            type="time"
            v-model="discountSchedule[i].end_time"
            class="input input-bordered w-full col-span-4"
            :disabled="!discountSchedule[i].active"
            step="3600"
          >
        </div>
      </div>

      <!-- BUTTONS -->
      <div class="flex justify-end space-x-4">
        <base-button type="button" @click="closeScheduleModal">
          Cancelar
        </base-button>
        <button
          type="button"
          class="px-4 py-2 text-sm font-medium text-white bg-brand-orange rounded-md hover:bg-brand-pink"
          @click="closeScheduleModal"
        >
          Guardar horarios
        </button>
      </div>
    </div>
  </dialog>
</template>

<script lang="ts" setup>
import { useVuelidate } from '@vuelidate/core'
import { IconHelpCircle, IconClock } from '@tabler/icons-vue'
import { required, helpers, minValue } from '@vuelidate/validators'
import { ref, reactive, computed } from 'vue'
import { useProduct } from '@/composables/useProduct'
import { CreateDiscount, Response, DiscountSchedule, Discount } from '@/api/interfaces'
import { createDiscount, getDiscounts } from '@/api/electron'
import { useBranch } from '@/composables/useBranch'
import { validateOnlyNumbers } from '@/utils/InputValidators'
import { toast } from 'vue3-toastify'

const { setDiscounts } = useProduct()
const { branch } = useBranch()

// DATEPICKERS
const inputStartDateRef = ref()
const inputEndDateRef = ref()
const formatDate = (date: Date) => {
  const day = date.getDate()
  const month = date.getMonth() + 1
  const year = date.getFullYear()

  return `${day}/${month.toString().padStart(2, '0')}/${year}`
}

const disabledDates = computed(() => {
  const startDate = formData.start_date
  if (!startDate) {
    return []
  }
  const today = new Date(startDate)
  return [...Array(today.getDate()).keys()].map((i) => new Date(today.getFullYear(), today.getMonth(), i + 1))
})

const selectStartDate = (date: Date) => {
  formData.start_date = date
  inputStartDateRef.value.closeMenu()
}

const selectEndDate = (date: Date) => {
  formData.end_date = date
  inputEndDateRef.value.closeMenu()
}

// SCHEDULE DIALOG
const dialogScheduleRef = ref()
const openScheduleModal = () => {
  dialogScheduleRef.value.showModal()
}
const closeScheduleModal = () => {
  dialogScheduleRef.value.close()
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

const discountSchedule = ref<{ day: Day, active: boolean, start_time: string, end_time: string }[]>([
  { day: 'monday', active: false, start_time: '08:00', end_time: '17:00' },
  { day: 'tuesday', active: false, start_time: '08:00', end_time: '17:00' },
  { day: 'wednesday', active: false, start_time: '08:00', end_time: '17:00' },
  { day: 'thursday', active: false, start_time: '08:00', end_time: '17:00' },
  { day: 'friday', active: false, start_time: '08:00', end_time: '17:00' },
  { day: 'saturday', active: false, start_time: '08:00', end_time: '17:00' },
  { day: 'sunday', active: false, start_time: '08:00', end_time: '17:00' },
])

const toggleScheduleDay = (dayIndex: number) => {
  discountSchedule.value[dayIndex].active = !discountSchedule.value[dayIndex].active
}

// DIALOG
const dialogCreateDiscountRef = ref()
const dropdownTypeRef = ref()

const openCreateDiscountModal = () => {
  dialogCreateDiscountRef.value.showModal()
}

const closeCreateDiscountModal = () => {
  dialogCreateDiscountRef.value.close()
  vCreate$.value.$reset()
  clearFormData()
}

const clearFormData = () => {
  formData.description = ''
  formData.type = 'percentage'
  formData.value = 0
  formData.condition_quantity = 0
  formData.discount_for_one = false
  formData.start_date = new Date()
  formData.end_date = null
  formData.schedule = []
}

// CREATE CATEGORY
const formData = reactive({
  description: '',
  type: 'percentage',
  value: 0,
  condition_quantity: 0,
  discount_for_one: false,
  start_date: new Date(),
  end_date: null as Date | null,
  schedule: [] as Array<DiscountSchedule>,
})

const type = computed(() => formData.type === 'percentage' ? 'Porcentaje' : 'Monto fijo')
const setType = (value: 'percentage' | 'amount') => {
  formData.type = value
  dropdownTypeRef.value.blur()
}

const discountValue = computed({
  get: () => formData.value.toString(),
  set: (value) => formData.value = Number(value),
})

const editDiscountValue = (value: string) => {
  discountValue.value += value
}

const backspaceDiscountValue = () => {
  discountValue.value = discountValue.value.slice(0, -1)
}

const rules = {
  description: { required: helpers.withMessage('La descripción es requerida', required) },
  value: {
    required: helpers.withMessage('El valor es requerido', required),
    min: helpers.withMessage('El valor debe ser mayor a 0', minValue(0.01)),
  },
  condition_quantity: {
    min: helpers.withMessage('La cantidad mínima debe ser mayor a 0', minValue(0)),
  },
}

const vCreate$ = useVuelidate(rules, formData)

const handleSubmitCreate = async () => {
  const isFormValid = await vCreate$.value.$validate()
  if (!isFormValid) {
    toast.warn('Formulario no válido, revise los errores')
    return
  }
  const discountScheduleSaved = discountSchedule.value.map((schedule) => {
    return {
      day: schedule.day,
      start_time: schedule.start_time,
      end_time: schedule.end_time,
    }
  })
  const newDiscount: CreateDiscount = {
    id_company: branch.value.id_company,
    id_branch: branch.value.id,
    description: formData.description,
    type: formData.type as 'percentage' | 'amount',
    value: formData.value,
    condition_quantity: formData.condition_quantity || undefined,
    discount_for_one: formData.discount_for_one,
    start_date: formData.start_date,
    end_date: formData.end_date ?? undefined,
    schedule: discountScheduleSaved,
    status: 'active',
  }
  createDiscount(newDiscount, (response: Response<any>) => {
    if (!response.success) {
      toast.error(response.message)
      return
    }
    getAllDiscounts()
    closeCreateDiscountModal()
    toast.success('Descuento creado exitosamente')
  })
}

const getAllDiscounts = async () => {
  getDiscounts((response: Response<Discount[]>) => {
    if (!response.success) {
      toast.error(response.message)
      return
    }
    setDiscounts(response.response)
  })
}

defineExpose({
  openCreateDiscountModal,
})
</script>