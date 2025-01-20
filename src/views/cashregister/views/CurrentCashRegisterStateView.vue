<template>
  <div class="p-8 pt-4 w-full max-w-[1080px] mx-auto">
    <h6 class="text-2xl font-bold mb-4">
      Estado actual de la caja
    </h6>

    <div class="grid grid-cols-2 gap-4">
      <!-- TOTAL SALES -->
      <div class="state-card mb-8">
        <h6 class="text-lg font-bold mb-4">
          Total de ventas
        </h6>
        <p class="text-sm text-gray-500">
          Ventas realizadas en el día
        </p>
        <p class="text-2xl font-bold">
          {{ cashRegisterState.total_sales }}
        </p>
      </div>

      <!-- TOTAL AMOUNT PAID -->
      <div class="state-card mb-8">
        <h6 class="text-lg font-bold mb-4">
          Total pagado
        </h6>
        <p class="text-sm text-gray-500">
          Total de dinero recibido
        </p>
        <p class="text-2xl font-bold">
          {{ formatCurrency(cashRegisterState.total_amount_paid) }}
        </p>
      </div>

      <!-- TOTAL CASH -->
      <div class="state-card">
        <div class="flex items-center gap-x-2 mb-4">
          <h6 class="text-lg font-bold">
            Ventas en efectivo
          </h6>
          <IconCash size="24" stroke-width="2" />
        </div>
        <p class="text-sm text-gray-500">
          Total de dinero en efectivo de ventas
        </p>
        <p class="text-2xl font-bold">
          {{ formatCurrency(cashRegisterState.payments.cash) }}
        </p>
      </div>

      <!-- TOTAL CARD -->
      <div class="state-card">
        <div class="flex items-center gap-x-2 mb-4">
          <h6 class="text-lg font-bold">
            Ventas con tarjeta
          </h6>
          <IconCreditCard size="24" stroke-width="2" />
        </div>
        <p class="text-sm text-gray-500">
          Total de ventas con tarjeta
        </p>
        <p class="text-2xl font-bold">
          {{ formatCurrency(cashRegisterState.payments.card) }}
        </p>
      </div>

      <!-- TOTAL TRANSFER -->
      <div class="state-card">
        <div class="flex items-center gap-x-2 mb-4">
          <h6 class="text-lg font-bold">
            Ventas por transferencia
          </h6>
          <IconTransferVertical size="24" stroke-width="2" />
        </div>
        <p class="text-sm text-gray-500">
          Total de ventas por transferencia
        </p>
        <p class="text-2xl font-bold">
          {{ formatCurrency(cashRegisterState.payments.transfer) }}
        </p>
      </div>

      <!-- TOTAL OTHER -->
      <div class="state-card">
        <h6 class="text-lg font-bold  mb-4">
          Ventas con otros medios de pago
        </h6>
        <p class="text-sm text-gray-500">
          Total de ventas con otros medios de pago
        </p>
        <p class="text-2xl font-bold">
          {{ formatCurrency(cashRegisterState.payments.other) }}
        </p>
      </div>

      <!-- OPENING AMOUNT -->
      <div class="state-card">
        <h6 class="text-lg font-bold mb-4">
          Monto de apertura
        </h6>
        <p class="text-sm text-gray-500">
          Monto con el que se abrió la caja
        </p>
        <p class="text-2xl font-bold">
          {{ formatCurrency(cashRegisterState.opening_amount) }}
        </p>
      </div>

      <!-- TOTAL CASH REGISTER -->
      <div class="state-card blue-card">
        <h6 class="text-lg font-bold mb-4 text-white">
          Total en caja
        </h6>
        <p class="text-sm text-white-3">
          Total de dinero en efectivo en caja
        </p>
        <p class="text-2xl font-bold text-white">
          {{ formatCurrency(cashRegisterState.opening_amount + cashRegisterState.payments.cash) }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getCurrentCashRegisterState } from '@/api/electron'
import { ref } from 'vue'
import { CashRegisterState } from '@/api/interfaces'
import { toast } from 'vue3-toastify'
import { useCurrency } from '@/composables/useCurrency'
import { IconCash, IconCreditCard, IconTransferVertical } from '@tabler/icons-vue'

const { formatCurrency } = useCurrency()

const cashRegisterState = ref<CashRegisterState>({
  payments: {
    cash: 0,
    card: 0,
    transfer: 0,
    other: 0,
  },
  opening_amount: 0,
  total_amount_paid: 0,
  total_sales: 0,
})

const getCashRegisterState = async () => {
  const response = await getCurrentCashRegisterState()
  if (!response.success) {
    return toast.error('No se pudo obtener el estado actual de la caja')
  }
  console.log(response.response)
  cashRegisterState.value = response.response
}

getCashRegisterState()
</script>

<style scoped>
.state-card {
  padding: 16px;
  border-radius: 16px;
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.state-card.blue-card {
  background-color: #6A81FB;
  color: #fff;
}
</style>