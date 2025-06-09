<template>
  <div class="p-8 pt-4 h-full w-full max-w-[1080px] mx-auto">
    <section class="custom-grid gap-4 h-full">
      <header class="col-span-2 h-[40px]">
        <h6 class="text-2xl font-bold">
          Cierre de caja
        </h6>
      </header>
      <div
        class="col-span-1 flex flex-col items-center justify-start gap-4 p-8"
      >
        <div class="flex items-center gap-4 mb-8">
          <button
            class="btn rounded-md min-w-36"
            :class="{
              'bg-brand-blue hover:bg-brand-blue/80 text-white':
                actionType === 'add',
            }"
            @click="handleActionType('add')"
          >
            <IconCirclePlus size="24" />
            Agregar
          </button>
          <button
            class="btn rounded-md min-w-36"
            :class="{ 'btn-error text-white': actionType === 'subtract' }"
            @click="handleActionType('subtract')"
          >
            <IconCircleMinus size="24" />
            Restar
          </button>
        </div>
        <div class="grid grid-cols-3 gap-4 w-full mb-4">
          <base-button
            v-for="denomination in currencyDenominationOptions"
            :key="`denomination-option-${denomination.denomination}`"
            class="flex items-center justify-start gap-2 py-8 relative"
            :class="{ 'red-dot': isCurrencyInCashRegister(denomination) > 0 }"
            @click="handleCurrencyDenomination(denomination)"
            :data-quantity="isCurrencyInCashRegister(denomination)"
          >
            <IconCoin
              v-if="denomination.type === 'coin'"
              size="24"
              class="text-yellow-500"
            />
            <IconCashBanknote v-else size="24" class="text-green-500" />
            <span class="font-medium">{{ denomination.label }}</span>
          </base-button>
          <base-button
            @click="handleClearAll"
            class="flex items-center justify-start gap-2 py-8"
          >
            <IconCircleX size="24" class="text-red-500" />
            Limpiar todo
          </base-button>
        </div>

        <div class="space-y-3 w-full">
          <div class="flex items-center gap-2 text-black-2 font-medium">
            <IconCreditCard size="24" />
            <p class="text-sm">
              Monto vendido por tarjeta (credito/debito)
            </p>
          </div>
          <div class="flex items-center">
            <currency-input
              class-name="max-w-[160px]"
              :value="cardAmount"
              @add:value="editCardAmount"
              @backspace="removeCardAmount"
            />
            <delete-button @click="removeCardAmount" />
          </div>
        </div>
      </div>

      <div
        class="col-span-1 bg-white rounded-xl p-6 flex flex-col justify-between"
      >
        <div>
          <h6 class="text-lg font-bold text-black-2">
            Información de la caja antes de cierre
          </h6>
          <p class="text-sm text-black-3 mb-4">
            Comprueba que la información sea correcta y corresponda al monto que
            contabilizas en la caja
          </p>

          <div class="space-y-3 pl-4 border-l-2 border-black-3 mb-2">
            <div class="flex items-center justify-between">
              <span class="text-black-2 font-medium">Monto de apertura</span>
              <span class="text-black-2 font-medium">{{
                formatCurrency(cashRegisterState.opening_amount)
              }}</span>
            </div>
            <!-- CASH SALES -->
            <div class="flex items-center justify-between">
              <span class="text-black-2 text-sm text-nowrap">Ventas en efectivo</span>
              <div class="mx-2 border-b border-dotted border-black-2 w-full" />
              <span class="text-black-2 text-sm">{{
                formatCurrency(cashRegisterState.payments.cash)
              }}</span>
            </div>
            <!-- CARD SALES -->
            <div class="flex items-center justify-between">
              <span class="text-black-2 text-sm text-nowrap">Ventas con tarjeta</span>
              <div class="mx-2 border-b border-dotted border-black-2 w-full" />
              <span class="text-black-2 text-sm">{{
                formatCurrency(cashRegisterState.payments.card)
              }}</span>
            </div>
            <!-- TRANSFER SALES -->
            <div class="flex items-center justify-between">
              <span class="text-black-2 text-sm text-nowrap">Ventas por transferencia</span>
              <div class="mx-2 border-b border-dotted border-black-2 w-full" />
              <span class="text-black-2 text-sm">{{
                formatCurrency(cashRegisterState.payments.transfer)
              }}</span>
            </div>
            <!-- OTHER SALES -->
            <div class="flex items-center justify-between">
              <span class="text-black-2 text-sm text-nowrap">Ventas de otros medios</span>
              <div class="mx-2 border-b border-dotted border-black-2 w-full" />
              <span class="text-black-2 text-sm">{{
                formatCurrency(cashRegisterState.payments.other)
              }}</span>
            </div>
            <!-- INCOME -->
            <div class="flex items-center justify-between">
              <span class="text-black-2 text-sm text-nowrap">Ingresos</span>
              <div class="mx-2 border-b border-dotted border-black-2 w-full" />
              <span class="text-black-2 text-sm">{{
                formatCurrency(cashRegisterState.movements.income)
              }}</span>
            </div>
            <!-- WITHDRAW -->
            <div class="flex items-center justify-between">
              <span class="text-black-2 text-sm text-nowrap">Retiros</span>
              <div class="mx-2 border-b border-dotted border-black-2 w-full" />
              <span class="text-black-2 text-sm">{{
                formatCurrency(cashRegisterState.movements.withdraw)
              }}</span>
            </div>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-black-2 font-medium">Total de efectivo</span>
            <span class="text-black-2 font-medium">{{
              formatCurrency(cashRegisterCashAmount)
            }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-black-2 font-medium">Total de ventas</span>
            <span class="text-black-2 font-medium">{{
              formatCurrency(cashRegisterState.total_amount_paid)
            }}</span>
          </div>
          <div class="divider my-1" />
          <div class="flex items-center justify-between">
            <span class="text-black-2 font-medium">Monto de cierre (efectivo)</span>
            <span class="text-black-2 font-medium">{{
              formatCurrency(totalInCashRegister)
            }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-black-2 font-medium">Total de cierre</span>
            <span class="text-black-2 font-medium">{{
              formatCurrency(Number(cardAmount) + Number(totalInCashRegister))
            }}</span>
          </div>
        </div>

        <!-- FOOTER -->
        <div class="grid grid-cols-2 gap-2">
          <button
            class="btn bg-brand-orange hover:bg-brand-orange/80 text-white"
            @click="handleCreateCashRegisterAudit(Closure.Partial)"
          >
            Cierre parcial
          </button>
          <button
            class="btn btn-neutral"
            @click="handleCreateCashRegisterAudit(Closure.Full)"
          >
            Cierre total
          </button>
        </div>
      </div>
    </section>
  </div>

  <confirm-audit-modal v-model="showConfirmAuditModal" @confirm:audit="handleConfirmAudit" />
</template>

<script setup lang="ts">
import { IconCreditCard } from '@tabler/icons-vue'
import ConfirmAuditModal from '@/views/cashregister/components/ConfirmAuditModal.vue'
import { Denomination, Response } from '@/api/interfaces'
import {
  IconCirclePlus,
  IconCircleMinus,
  IconCoin,
  IconCashBanknote,
  IconCircleX
} from '@tabler/icons-vue'
import { CashRegisterState } from '@/api/interfaces'
import { getCurrentCashRegisterState } from '@/api/electron'
import { useCurrency } from '@/composables/useCurrency'
import { toast } from 'vue3-toastify'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  CashRegisterAudit,
  Closure,
  CreateCashRegisterAudit
} from '@/api/interfaces/cashRegisterAudits'
import { useCashRegister } from '@/composables/useCashRegister'
import { useUser } from '@/composables/useUser'
import { closeCashRegister } from '@/api/electron'

const { formatCurrency } = useCurrency()

const cashRegisterState = ref<CashRegisterState>({
  payments: {
    cash: 0,
    card: 0,
    transfer: 0,
    other: 0,
  },
  movements: {
    income: 0,
    withdraw: 0,
  },
  opening_amount: 0,
  total_amount_paid: 0,
  total_sales_amount: 0,
  total_sales: 0,
  total_movements: 0,
})
const cashRegisterCashAmount = computed(() => {
  return (
    cashRegisterState.value.payments.cash +
    cashRegisterState.value.movements.income -
    cashRegisterState.value.movements.withdraw +
    cashRegisterState.value.opening_amount
  )
})

const getCashRegisterState = async () => {
  const response = await getCurrentCashRegisterState()
  if (!response.success) {
    return toast.error('No se pudo obtener el estado actual de la caja')
  }
  cashRegisterState.value = response.response
}

getCashRegisterState()

const actionType = ref<'add' | 'subtract'>('add')

const handleActionType = (type: 'add' | 'subtract') => {
  actionType.value = type
}

type DenominationOption = {
  denomination: string
  type: 'coin' | 'bill'
  label: string
}

const currencyInCashRegister = ref<Denomination[]>([])
const totalInCashRegister = computed(() => {
  return currencyInCashRegister.value.reduce((total, denomination) => {
    return total + Number(denomination.denomination) * denomination.quantity
  }, 0)
})

const currencyDenominationOptions: DenominationOption[] = [
  { denomination: '50', type: 'coin', label: '$ 0.5' },
  { denomination: '100', type: 'coin', label: '$ 1' },
  { denomination: '200', type: 'coin', label: '$ 2' },
  { denomination: '500', type: 'coin', label: '$ 5' },
  { denomination: '1000', type: 'coin', label: '$ 10' },
  { denomination: '2000', type: 'bill', label: '$ 20' },
  { denomination: '5000', type: 'bill', label: '$ 50' },
  { denomination: '10000', type: 'bill', label: '$ 100' },
  { denomination: '20000', type: 'bill', label: '$ 200' },
  { denomination: '50000', type: 'bill', label: '$ 500' },
  { denomination: '100000', type: 'bill', label: '$ 1000' },
]

const handleCurrencyDenomination = (denomination: DenominationOption) => {
  if (actionType.value === 'add') {
    addCurrencyToCashRegister(denomination)
  } else {
    removeCurrencyFromCashRegister(denomination)
  }
}

const addCurrencyToCashRegister = (denomination: DenominationOption) => {
  const findIndexDenomination = currencyInCashRegister.value.findIndex(
    (d) => d.denomination === denomination.denomination
  )
  if (findIndexDenomination !== -1) {
    currencyInCashRegister.value[findIndexDenomination].quantity++
    return
  }
  currencyInCashRegister.value.push({
    denomination: denomination.denomination,
    type: denomination.type,
    quantity: 1,
  })
}

const removeCurrencyFromCashRegister = (denomination: DenominationOption) => {
  const findIndexDenomination = currencyInCashRegister.value.findIndex(
    (d) => d.denomination === denomination.denomination
  )
  if (findIndexDenomination !== -1) {
    currencyInCashRegister.value[findIndexDenomination].quantity--
    if (currencyInCashRegister.value[findIndexDenomination].quantity === 0) {
      currencyInCashRegister.value.splice(findIndexDenomination, 1)
    }
  }
}

const isCurrencyInCashRegister = (denomination: DenominationOption) => {
  const findIndexDenomination = currencyInCashRegister.value.findIndex(
    (d) => d.denomination === denomination.denomination
  )
  if (findIndexDenomination !== -1) {
    return currencyInCashRegister.value[findIndexDenomination].quantity
  }
  return 0
}

const handleClearAll = () => {
  currencyInCashRegister.value = []
}

// CREATE CASH AUDIT
const { cashRegister } = useCashRegister()
const { user, logout } = useUser()
const router = useRouter()

const cardAmount = ref('')
const editCardAmount = (value: string) => {
  cardAmount.value += value
}

const removeCardAmount = () => {
  cardAmount.value = cardAmount.value.slice(0, -1)
}

// SHOW CONFIRM AUDIT MODAL
const showConfirmAuditModal = ref(false)
const closureSelected = ref<Closure>(Closure.Partial)
const handleCreateCashRegisterAudit = (closure: Closure) => {
  showConfirmAuditModal.value = true
  closureSelected.value = closure
}

// CONFIRM AUDIT
const prepareCashRegisterAudit = (): CreateCashRegisterAudit => {
  const totalAmount = cashRegisterCashAmount.value + cashRegisterState.value.payments.card
  const balance = totalAmount + Number(cardAmount.value)
  const difference = balance - totalAmount

  const cashBreakdown: Denomination[] = currencyInCashRegister.value.map((denomination) => ({
    denomination: String(denomination.denomination),
    type: denomination.type,
    quantity: denomination.quantity,
  }))
  return {
    id_cash_register: cashRegister.value?.id || '',
    id_user: user.value?.id || '',
    cash_amount: cashRegisterState.value.payments.cash,
    card_amount: cashRegisterState.value.payments.card,
    transfer_amount: cashRegisterState.value.payments.transfer,
    other_amount: cashRegisterState.value.payments.other,
    income: cashRegisterState.value.movements.income,
    withdraw: cashRegisterState.value.movements.withdraw,
    total_amount: totalAmount,
    balance,
    difference,
    cash_breakdown: cashBreakdown,
    card_breakdown: Number(cardAmount.value),
    count_sales: cashRegisterState.value.total_sales,
    count_movements: cashRegisterState.value.total_movements,
    closure: closureSelected.value,
  }
}

const handleConfirmAudit = () => {
  const payload = prepareCashRegisterAudit()
  closeCashRegister(payload, (response: Response<CashRegisterAudit>) => {
    if (!response.success) {
      return toast.error('No se pudo cerrar la caja')
    }
    toast.success('Caja cerrada exitosamente')
    logout()
    router.push({ name: 'SignInAsUser' })
  })
}
</script>

<style scoped>
.custom-grid {
  display: grid;
  grid-template-rows: 40px 1fr;
  grid-template-columns: 1fr 1fr;
}

.red-dot {
  &::after {
    content: attr(data-quantity);
    position: absolute;
    top: -8px;
    right: -8px;
    width: 24px;
    height: 24px;
    background-color: var(--mandy-pink);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 12px;
  }
}
</style>
