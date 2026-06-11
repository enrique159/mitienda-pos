<template>
  <div class="overflow-hidden">
    <header class="w-full h-fit px-8 py-4 bg-white border-b border-gray-200 flex items-center justify-between">
      <h1 class="text-2xl text-black-2 font-medium">
        Clientes
      </h1>

      <div class="flex items-center gap-4">
        <label class="input bg-white-1 border border-white-3 input-sm flex items-center gap-2">
          <input v-model="search" type="text" class="grow" placeholder="Buscar cliente..">
          <IconSearch class="w-4 h-4 text-black-2" />
        </label>
      </div>
    </header>

    <div class="overflow-auto h-table">
      <table class="table table-sm bg-white rounded-none">
        <thead>
          <tr>
            <th class="w-12" />
            <th>Nombre</th>
            <th>Teléfono</th>
            <th>Estado</th>
            <th>Crédito</th>
            <th>Crédito usado</th>
            <th>Próximo pago</th>
            <th>Fecha creación</th>
            <th />
          </tr>
        </thead>
        <tbody>
          <tr v-for="(customer, i) in filteredCustomers" :key="`customer-${customer.id}`" :class="i % 2 === 0 ? 'bg-table-row' : 'bg-white'">
            <td>
              <span class="text-sm text-black-3">{{ i + 1 }}</span>
            </td>
            <td class="whitespace-nowrap max-w-[12rem] overflow-hidden overflow-ellipsis">
              {{ customer.name }}
            </td>
            <td class="whitespace-nowrap">
              {{ formatPhone(customer.phone) }}
            </td>
            <td>
              <div
                class="badge font-medium border-none"
                :class="[customer.status === 'active' ? 'text-green-500 bg-success/20' : 'text-black-3 bg-white-2']"
              >
                {{ customer.status === 'active' ? 'activo' : 'inactivo' }}
              </div>
            </td>
            <td>
              <span v-if="customer.has_credit">
                {{ formatCurrency(customer.credit_limit) }}
              </span>
              <span v-else class="text-black-3">
                Sin crédito
              </span>
            </td>
            <td>
              <div v-if="customer.has_credit" class="tooltip tooltip-bottom" :data-tip="formatCurrency(customer.used_credit)">
                <progress
                  class="progress w-24"
                  :class="getProgressColorByCreditUsed(customer.used_credit, customer.credit_limit)"
                  :value="customer.used_credit"
                  :max="customer.credit_limit"
                />
              </div>
              <span v-else class="text-black-3">-</span>
            </td>
            <td
              :class="[
                customer.has_credit && isPaymentDueDateToday(getNextPaymentDueDateCustomer(customer.payment_due_date, 'MM/DD/YYYY')) ? 'text-red-500' : '',
                customer.has_credit && isPaymentDueDateInNext7Days(getNextPaymentDueDateCustomer(customer.payment_due_date, 'MM/DD/YYYY')) ? 'text-yellow-500' : '',
              ]"
            >
              <div v-if="customer.has_credit" class="tooltip tooltip-bottom" :data-tip="getRelativeTime(getNextPaymentDueDateCustomer(customer.payment_due_date, 'MM/DD/YYYY'))">
                <span>{{ getNextPaymentDueDateCustomer(customer.payment_due_date) }}</span>
              </div>
              <span v-else class="text-black-3">-</span>
            </td>
            <td>{{ formatDatetimeShort(customer.created_at) }}</td>
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
                  <li @click.stop="openUpdateCustomerView(customer)">
                    <a>
                      <IconEdit class="w-4 h-4" />
                      Editar cliente
                    </a>
                  </li>
                  <li @click.stop="openCustomerCreditView(customer)">
                    <a>
                      <IconCreditCard class="w-4 h-4" />
                      {{ customer.has_credit ? 'Editar crédito' : 'Asignar crédito' }}
                    </a>
                  </li>
                  <li @click.stop="deleteCustomerHandler(customer.id)">
                    <a class="text-brand-pink">
                      <IconTrash class="w-4 h-4" />
                      Eliminar cliente
                    </a>
                  </li>
                </ul>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { IconCreditCard, IconDotsVertical, IconEdit, IconSearch, IconTrash } from '@tabler/icons-vue'
import dayjs from 'dayjs'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import { getCustomers, deleteCustomer } from '@/api/electron'
import { Customer, Response } from '@/api/interfaces'
import { useCustomer } from '@/composables/useCustomer'
import { useCurrency } from '@/composables/useCurrency'
import { useDate } from '@/composables/useDate'
import { toast } from '@/composables/useToast'
import { formatPhone } from '@/utils/Phone'

dayjs.extend(isSameOrAfter)

const router = useRouter()
const { formatDatetimeShort, getNextPaymentDueDateCustomer, getRelativeTime } = useDate()
const { formatCurrency } = useCurrency()
const { customers, setCustomers } = useCustomer()

const search = ref('')

const getAllCustomers = async () => {
  const response = await getCustomers()
  if (!response.success) {
    return toast.error(response.message)
  }
  setCustomers(response.response)
}

getAllCustomers()

const filteredCustomers = computed(() => {
  return customers.value.filter((customer) => {
    return customer.name.toLowerCase().includes(search.value.toLowerCase())
  })
})

const deleteCustomerHandler = async (customerId: string) => {
  deleteCustomer(customerId, (response: Response<any>) => {
    if (!response.success) {
      return toast.error(response.message)
    }
    toast.success('Cliente eliminado exitosamente')
    getAllCustomers()
  })
}

const openUpdateCustomerView = (customer: Customer) => {
  router.push({ name: 'UpdateClientView', params: { id: customer.id } })
}

const openCustomerCreditView = (customer: Customer) => {
  router.push({ name: 'CustomerCreditView', params: { id: customer.id } })
}

const getProgressColorByCreditUsed = (creditUsed: number, creditLimit: number) => {
  if (!creditLimit) return 'progress'
  const percentage = (creditUsed / creditLimit) * 100
  if (percentage < 50) {
    return 'progress-success'
  } else if (percentage < 75) {
    return 'progress-warning'
  } else {
    return 'progress-error'
  }
}

const isPaymentDueDateToday = (paymentDueDate: string | null) => {
  if (!paymentDueDate) return false
  const today = dayjs()
  const dueDate = dayjs(paymentDueDate)

  return dueDate.isSame(today, 'day')
}

const isPaymentDueDateInNext7Days = (paymentDueDate: string | null) => {
  if (!paymentDueDate) return false
  const today = dayjs()
  const dueDate = dayjs(paymentDueDate)

  return dueDate.isSameOrAfter(today) && dueDate.isBefore(today.add(7, 'day'))
}
</script>

<style lang="scss" scoped></style>
