<template>
  <div class="overflow-auto h-table">
    <table class="table table-sm bg-white rounded-none">
      <!-- head -->
      <thead>
        <tr>
          <th class="w-40">
            Fecha
          </th>
          <th>Responsable</th>
          <th>Tipo</th>
          <th>Motivo</th>
          <th>Descripción</th>
          <th>Monto</th>
        </tr>
      </thead>

      <tbody>
        <!-- row 1 -->
        <tr v-for="(movement, i) in movements" :key="`sale-row-${movement.id}`" :class="i % 2 === 0 ? 'bg-table-row' : 'bg-white'">
          <td>
            {{ formatDatetimeShort(movement.created_at) }}
          </td>
          <td>
            {{ movement.seller?.name || '-' }}
          </td>
          <td>
            <div class="p-1 rounded-full w-fit lowercase px-3" :class="{
              'bg-green-500/10 text-green-500': movement.type === CashMovementType.INCOME,
              'bg-red-500/10 text-red-500': movement.type === CashMovementType.WITHDRAW,
            }">
              {{ getMovementTypeName(movement.type) }}
            </div>
          </td>
          <td>{{ getMovementReasonLabel(movement.reason) }}</td>
          <td>
            <div class="tooltip tooltip-bottom max-w-[260px]" :data-tip="movement.description">
              <p class="truncate">
                {{ movement.description }}
              </p>
            </div>
          </td>
          <td>
            {{ formatCurrency(movement.amount) }}
          </td>
        </tr>
      </tbody>
    </table>
    <div v-if="emptyMovements" class="h-full grid place-items-center">
      <div class="bg-white-1 p-4 rounded-lg w-full h-fit flex flex-col justify-center items-center">
        <img src="@/assets/empty_sales.svg" alt="Verificar producto" class="w-32 mb-4">
        <h6 class="text-lg font-bold text-black-2">
          No hay movimientos aún
        </h6>
        <p class="text-sm text-black-3 text-center w-1/2">
          Aún no hay movimientos registrados. Puedes registrar un movimiento desde el menú de caja en la opción de Ingresar o retirar.
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import { Response, CashMovement, CashMovementType } from '@/api/interfaces'
import { getMovementsInTurn } from '@/api/electron'
import { useCurrency } from '@/composables/useCurrency'
import { useDate } from '@/composables/useDate'
import { toast } from '@/composables/useToast'
import { useCashRegister } from '@/composables/useCashRegister'

const { formatDatetimeShort, formatDatetime } = useDate()
const { formatCurrency } = useCurrency()
const { cashRegister, getMovementReasonLabel } = useCashRegister()

const movements = ref<CashMovement[]>([])

const emptyMovements = computed(() => {
  return movements.value.length === 0
})

const getMovementTypeName = (type: CashMovementType) => {
  switch (type) {
    case CashMovementType.INCOME:
      return 'Ingreso'
    case CashMovementType.WITHDRAW:
      return 'Retiro'
    default:
      return 'Otro'
  }
}
onMounted(async () => {
  if (!cashRegister.value) return
  getMovementsInTurn(cashRegister.value.id, (response: Response<CashMovement[]>) => {
    if (!response.success) {
      toast.error(response.message)
      return
    }
    movements.value = response.response
  })
})
</script>