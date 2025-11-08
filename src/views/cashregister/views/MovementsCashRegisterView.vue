<template>
  <div class="p-8 pt-4 h-full w-full max-w-[1080px] mx-auto">
    <section class="custom-grid gap-4 h-full">
      <header class="col-span-2 h-[40px]">
        <h6 class="text-2xl font-bold">Ingresa o retira de caja</h6>
      </header>
      <div
        class="col-span-1 flex flex-col items-center justify-center gap-4 bg-white rounded-xl"
      >
        <div class="flex items-center gap-4 mb-8">
          <button
            class="btn rounded-md"
            :class="{
              'btn-success text-white':
                movementType === CashMovementType.INCOME,
            }"
            @click="handleMovementType(CashMovementType.INCOME)"
          >
            <IconSwipeRight size="24" />
            Ingresar
          </button>
          <button
            class="btn rounded-md"
            :class="{
              'btn-error text-white':
                movementType === CashMovementType.WITHDRAW,
            }"
            @click="handleMovementType(CashMovementType.WITHDRAW)"
          >
            <IconSwipeLeft size="24" />
            Retirar
          </button>
        </div>
        <div class="flex items-center">
          <currency-input
            class-name="max-w-[160px]"
            :value="movementQuantity"
            @add:value="editMovementQuantity"
            @backspace="removeMovementQuantity"
          />
          <delete-button @click="removeMovementQuantity" />
        </div>
        <pin-input @input="editMovementQuantity" dot-disabled />
      </div>
      <div class="flex flex-col justify-between gap-4">
        <div class="space-y-4">
          <select
            class="select select-md w-full"
            :class="{ 'text-slate-400': !movementTypeReason }"
            :value="movementTypeReason"
            @change="
              movementTypeReason = ($event.target as HTMLSelectElement).value
            "
          >
            <option disabled selected value="">
              Seleccione la razón del movimiento
            </option>
            <option
              v-for="reason in currentReasons"
              :key="reason.value"
              :value="reason.value"
            >
              {{ reason.label }}
            </option>
          </select>

          <textarea
            class="textarea w-full"
            placeholder="Descripción de los motivos del movimiento.."
            rows="8"
            v-model="movementComments"
          />
        </div>

        <button
          :disabled="!movementTypeReason || !movementQuantity"
          class="btn btn-lg w-full bg-brand-blue hover:bg-brand-blue/80 text-white"
          @click="handleCreateCashMovement"
        >
          Realizar movimiento
        </button>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import CurrencyInput from '@/components/inputs/CurrencyInput.vue'
import { IconSwipeRight, IconSwipeLeft } from '@tabler/icons-vue'
import {
  CashMovement,
  CashMovementType,
  CreateCashMovement,
  Response,
  withdrawalReasons,
  depositReasons,
} from '@/api/interfaces'
import { createCashMovement } from '@/api/electron'
import { computed, ref } from 'vue'
import { toast } from '@/composables/useToast'
import { useCashRegister } from '@/composables/useCashRegister'
import { useUser } from '@/composables/useUser'

const movementType = ref<CashMovementType>(CashMovementType.INCOME)
const movementQuantity = ref('')
const movementComments = ref('')
const movementTypeReason = ref('')

const currentReasons = computed(() => {
  return movementType.value === CashMovementType.INCOME
    ? depositReasons
    : withdrawalReasons
})

const handleMovementType = (type: CashMovementType) => {
  movementType.value = type
  movementTypeReason.value = ''
}

const editMovementQuantity = (value: string) => {
  movementQuantity.value += value
}

const removeMovementQuantity = () => {
  movementQuantity.value = movementQuantity.value.slice(0, -1)
}

const { cashRegister } = useCashRegister()
const { user } = useUser()

const handleCreateCashMovement = () => {
  const data: CreateCashMovement = {
    id_cash_register: cashRegister.value?.id || '',
    id_seller: user.value?.id || '',
    amount: Number(movementQuantity.value),
    type: movementType.value,
    reason: movementTypeReason.value,
    description: movementComments.value,
  }
  createCashMovement(data, (response: Response<CashMovement>) => {
    if (!response.success) {
      toast.error(response.message)
    } else {
      toast.success('Movimiento creado correctamente')
      clearAll()
    }
  })
}

const clearAll = () => {
  movementType.value = CashMovementType.INCOME
  movementQuantity.value = ''
  movementComments.value = ''
  movementTypeReason.value = ''
}
</script>

<style scoped>
.custom-grid {
  display: grid;
  grid-template-rows: 40px 1fr;
  grid-template-columns: 1fr 1fr;
}
</style>
