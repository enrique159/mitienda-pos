<template>
  <div class="p-8 pt-4 w-full overflow-y-auto max-w-[1080px] mx-auto">
    <h6 class="text-2xl font-bold mb-4">
      {{ customer?.has_credit ? 'Editar crédito' : 'Asignar crédito' }}
    </h6>

    <div v-if="isLoadingCustomer" class="flex items-center gap-2 text-black-2">
      <span class="loading loading-spinner loading-sm" />
      Cargando cliente...
    </div>

    <form v-else-if="customer" @submit.prevent="saveCredit" class="w-full space-y-6">
      <section class="bg-white rounded-xl border border-white-3 p-4 space-y-1">
        <p class="text-sm text-black-3">
          Cliente
        </p>
        <h2 class="text-xl font-bold text-black-1">
          {{ customer.name }}
        </h2>
        <div class="grid grid-cols-3 gap-4 pt-3">
          <div>
            <p class="text-sm text-black-3">
              Crédito actual
            </p>
            <p class="font-semibold">
              {{ customer.has_credit ? formatCurrency(customer.credit_limit) : 'Sin crédito' }}
            </p>
          </div>
          <div>
            <p class="text-sm text-black-3">
              Crédito usado
            </p>
            <p class="font-semibold">
              {{ formatCurrency(customer.used_credit) }}
            </p>
          </div>
          <div>
            <p class="text-sm text-black-3">
              Disponible
            </p>
            <p class="font-semibold">
              {{ formatCurrency(availableCredit) }}
            </p>
          </div>
        </div>
      </section>

      <section class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label class="form-control w-full">
          <div class="label">
            <span class="label-text text-black-1 font-medium required">
              Límite de crédito
            </span>
          </div>
          <div class="flex items-start">
            <currency-input
              ref="creditLimitInputRef"
              :value="creditLimit"
              class-name="w-full"
              @add:value="editCreditLimit"
              @backspace="backspaceCreditLimit"
              @enter="saveCredit"
            />
            <delete-button @on:click="clearCreditLimit" />
          </div>
          <span class="text-sm text-black-3 mt-1">
            El límite se guarda como monto máximo disponible para ventas a crédito.
          </span>
        </label>

        <label class="form-control w-full">
          <div class="label">
            <span class="label-text text-black-1 font-medium required">
              Día de pago mensual
            </span>
          </div>
          <input
            v-model.number="paymentDueDay"
            class="input input-bordered w-full"
            type="number"
            min="1"
            max="31"
            placeholder="Ej. 15"
          />
          <span class="text-sm text-black-3 mt-1">
            Usa un día del 1 al 31 para calcular el próximo pago.
          </span>
        </label>
      </section>

      <section
        v-if="customer.has_credit"
        class="bg-white rounded-xl border border-white-3 p-4 flex items-center justify-between gap-4"
      >
        <div>
          <h3 class="font-bold text-black-1">
            Cancelar crédito
          </h3>
          <p class="text-sm text-black-2">
            Solo se puede cancelar cuando el cliente no tiene saldo pendiente.
          </p>
          <p v-if="customer.used_credit > 0" class="text-sm text-brand-pink mt-1">
            No se puede cancelar porque tiene {{ formatCurrency(customer.used_credit) }} pendiente.
          </p>
        </div>
        <base-button
          type="button"
          class="text-brand-pink font-medium"
          :disabled="customer.used_credit > 0"
          :loading="isCancellingCredit"
          loading-text="Cancelando..."
          @click="cancelCredit"
        >
          Cancelar crédito
        </base-button>
      </section>

      <div class="flex justify-end space-x-4">
        <base-button type="button" @click="returnToCustomers">
          Volver
        </base-button>
        <base-button
          type="submit"
          button-type="primary"
          :loading="isSavingCredit"
          loading-text="Guardando..."
        >
          Guardar crédito
        </base-button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Customer, Response, UpdateCustomerCredit } from '@/api/interfaces'
import { getCustomers, updateCustomerCredit } from '@/api/electron'
import { useCustomer } from '@/composables/useCustomer'
import { useCurrency } from '@/composables/useCurrency'
import { toast } from '@/composables/useToast'

const route = useRoute()
const router = useRouter()
const { customers, setCustomers } = useCustomer()
const { formatCurrency } = useCurrency()

const customer = ref<Customer | null>(null)
const creditLimit = ref('')
const paymentDueDay = ref(30)
const isLoadingCustomer = ref(false)
const isSavingCredit = ref(false)
const isCancellingCredit = ref(false)
const creditLimitInputRef = ref()

const availableCredit = computed(() => {
  if (!customer.value?.has_credit) return 0
  return Math.max(0, customer.value.credit_limit - customer.value.used_credit)
})

const returnToCustomers = () => {
  router.push({ name: 'ClientsView' })
}

const editCreditLimit = (value: string) => {
  creditLimit.value += value
}

const backspaceCreditLimit = () => {
  creditLimit.value = creditLimit.value.slice(0, -1)
}

const clearCreditLimit = () => {
  creditLimit.value = ''
}

const setCustomerValues = (currentCustomer: Customer) => {
  customer.value = currentCustomer
  creditLimit.value = currentCustomer.has_credit
    ? String(currentCustomer.credit_limit)
    : '100000'
  paymentDueDay.value = Number(currentCustomer.payment_due_date || 30)
}

const refreshCustomers = async () => {
  const response = await getCustomers()
  if (!response.success) {
    toast.error(response.message)
    return []
  }
  setCustomers(response.response)
  return response.response
}

const loadCustomer = async () => {
  const customerId = String(route.params.id || '')
  if (!customerId) {
    toast.error('Cliente no encontrado')
    returnToCustomers()
    return
  }

  isLoadingCustomer.value = true
  const currentStoreCustomer = customers.value.find((item) => item.id === customerId)
  if (currentStoreCustomer) {
    setCustomerValues(currentStoreCustomer)
    isLoadingCustomer.value = false
    nextTick(() => creditLimitInputRef.value?.focus())
    return
  }

  const refreshedCustomers = await refreshCustomers()
  const refreshedCustomer = refreshedCustomers.find((item) => item.id === customerId)
  isLoadingCustomer.value = false

  if (!refreshedCustomer) {
    toast.error('Cliente no encontrado')
    returnToCustomers()
    return
  }

  setCustomerValues(refreshedCustomer)
  nextTick(() => creditLimitInputRef.value?.focus())
}

const validateCreditForm = () => {
  const creditLimitAmount = Number(creditLimit.value || 0)
  if (creditLimitAmount <= 0) {
    toast.warn('El límite de crédito debe ser mayor a $0.00')
    return false
  }

  if (!Number.isInteger(paymentDueDay.value) || paymentDueDay.value < 1 || paymentDueDay.value > 31) {
    toast.warn('El día de pago debe estar entre 1 y 31')
    return false
  }

  return true
}

const submitCreditUpdate = (payload: UpdateCustomerCredit, onDone: () => void) => {
  updateCustomerCredit(payload, async(response: Response<Customer>) => {
    isSavingCredit.value = false
    isCancellingCredit.value = false
    if (!response.success) {
      toast.error(response.message)
      return
    }

    const refreshedCustomers = await refreshCustomers()
    if (!refreshedCustomers.length) return
    onDone()
  })
}

const saveCredit = () => {
  if (isSavingCredit.value || !customer.value) return
  if (!validateCreditForm()) return

  isSavingCredit.value = true
  submitCreditUpdate(
    {
      id: customer.value.id,
      has_credit: true,
      credit_limit: Number(creditLimit.value),
      payment_due_date: String(paymentDueDay.value),
    },
    () => {
      toast.success('Crédito guardado exitosamente')
      returnToCustomers()
    }
  )
}

const cancelCredit = () => {
  if (isCancellingCredit.value || !customer.value) return
  if (customer.value.used_credit > 0) {
    toast.warn('No se puede cancelar un crédito con saldo pendiente')
    return
  }
  if (!confirm('¿Está seguro de cancelar el crédito de este cliente?')) return

  isCancellingCredit.value = true
  submitCreditUpdate(
    {
      id: customer.value.id,
      has_credit: false,
      credit_limit: 0,
      payment_due_date: null,
    },
    () => {
      toast.success('Crédito cancelado exitosamente')
      returnToCustomers()
    }
  )
}

onMounted(loadCustomer)
</script>
