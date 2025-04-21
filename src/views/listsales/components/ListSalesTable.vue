<template>
  <div class="overflow-auto h-table">
    <table class="table table-sm bg-white rounded-none">
      <!-- head -->
      <thead>
        <tr>
          <th class="w-40">
            Fecha
          </th>
          <th class="w-[180px]">
            Folio
          </th>
          <th>Vendedor</th>
          <th>Métodos de pago</th>
          <th>Estado</th>
          <th>Monto</th>
          <th class="w-12" />
        </tr>
      </thead>

      <tbody>
        <!-- row 1 -->
        <tr v-for="(sale, i) in sales" :key="`sale-row-${sale.id}`" :class="i % 2 === 0 ? 'bg-table-row' : 'bg-white'">
          <td>
            {{ formatDatetimeShort(sale.created_at) }}
          </td>
          <td>{{ sale.folio }}</td>
          <td>{{ sale.seller_name }}</td>
          <td>
            {{ sale.payments.map((payment) => getPaymentMethodName(payment.payment_method)).join(', ') }}
          </td>
          <td>
            <div class="badge font-medium border-none" :class="getBadgeColors(sale.status)">
              {{ getSaleStatusName(sale.status).toLowerCase() }}
            </div>
          </td>
          <td>
            {{ formatCurrency(sale.total) }}
          </td>
          <td>
            <button
              class="btn w-8 h-8 btn-xs rounded-full aspect-square grid place-items-center cursor-pointer"
              @click="openSaleDetailsModal(sale)"
            >
              <icon-dots-vertical class="w-4 h-4" />
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <div v-if="emptySales" class="h-full grid place-items-center">
      <div class="bg-white-1 p-4 rounded-lg w-full h-fit flex flex-col justify-center items-center">
        <img src="@/assets/empty_sales.svg" alt="Verificar producto" class="w-32 mb-4">
        <h6 class="text-lg font-bold text-black-2">
          No hay ventas aún
        </h6>
        <p class="text-sm text-black-3 text-center w-1/2">
          Aún no hay ventas registradas. Puedes registrar una nueva venta desde el menú de ventas o ajustar los filtros
          para encontrar las ventas que deseas.
        </p>
      </div>
    </div>
  </div>

  <!-- DIALOG SALE DETAILS -->
  <dialog id="dialogSaleDetails" ref="dialogSaleDetailsRef" class="modal" @keydown.escape="closeSaleDetailsModal">
    <div class="modal-box w-full max-w-[1000px] h-[80%]">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-bold">
          Detalles de la venta
        </h3>
        <div class="modal-action mt-0">
          <form method="dialog" @submit="closeSaleDetailsModal">
            <!-- if there is a button in form, it will close the modal -->
            <button class="close-btn">
              Cerrar
              <CustomKbd>ESC</CustomKbd>
            </button>
          </form>
        </div>
      </div>

      <div class="grid-content">
        <div class="w-full flex flex-col">
          <section class="w-full grid grid-cols-3 gap-x-2">
            <!-- FOLIO -->
            <div>
              <p class="text-sm text-black-3">
                Folio
              </p>
              <div class="flex items-center gap-2">
                <span>{{ selectedSale?.folio }}</span>
                <button class="btn btn-sm btn-circle btn-ghost" @click="copyFolio">
                  <IconCopy size="16" />
                </button>
              </div>
            </div>
            <!-- SELLER -->
            <div>
              <p class="text-sm text-black-3">
                Vendedor
              </p>
              <div class="flex items-center gap-2">
                <span>{{ selectedSale?.seller_name }}</span>
              </div>
            </div>
            <!-- DATE -->
            <div>
              <p class="text-sm text-black-3">
                Fecha
              </p>
              <div class="flex items-center gap-2">
                <span>{{ formatDatetime(selectedSale?.created_at) }}</span>
              </div>
            </div>
            <div class="divider my-0 col-span-3" />
          </section>
          <section class="w-full grid grid-cols-3 gap-x-2">
            <!-- STATUS -->
            <div>
              <p class="text-sm text-black-3">
                Estado
              </p>
              <div class="flex items-center gap-2">
                <span>{{ getSaleStatusName(selectedSale?.status).toLowerCase() }}</span>
              </div>
            </div>

            <!-- PAYMENTS -->
            <div>
              <p class="text-sm text-black-3">
                Métodos de pago
              </p>
              <div class="flex items-center gap-2">
                <span>{{ selectedSale?.payments.map((payment) => getPaymentMethodName(payment.payment_method)).join(', ') }}</span>
              </div>
            </div>

            <!-- TOTAL -->
            <div>
              <p class="text-sm text-black-3">
                Total
              </p>
              <div class="flex items-center gap-2">
                <span>{{ formatCurrency(selectedSale?.total!) }}</span>
              </div>
            </div>
            <div class="divider my-0 col-span-3" />
          </section>
        </div>

        <section class="w-full">
          <div role="tablist" class="tabs tabs-boxed">
            <a
              v-for="tab in tabOptions"
              :key="`tab-option-${tab.name}`"
              role="tab"
              class="tab transition-all"
              :class="selectedTab === tab.id ? 'tab-active bg-brand-blue text-white' : ''"
              @click="selectedTab = tab.id"
            >
              {{ tab.name }}
            </a>
          </div>
        </section>

        <section v-if="selectedTab === 1" class="overflow-hidden">
          <div class="overflow-scroll h-full">
            <table class="table table-sm bg-white rounded-none">
              <!-- head -->
              <thead>
                <tr>
                  <th class="w-12" />
                  <th>Producto</th>
                  <th>Cantidad</th>
                  <th>Precio de venta</th>
                  <th>Impuesto</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(sale, i) in selectedSale?.details"
                  :key="`sale-row-${sale.id}`"
                  :class="i % 2 === 0 ? 'bg-table-row' : 'bg-white'"
                >
                  <td>
                    <span class="text-sm text-black-3">{{ i + 1 }}</span>
                  </td>
                  <td>{{ sale.product_name }}</td>
                  <td>{{ sale.quantity }}</td>
                  <td>{{ formatCurrency(sale.selling_price) }}</td>
                  <td>{{ formatCurrency(sale.tax_amount) }}</td>
                  <td>{{ formatCurrency(sale.total) }}</td>
                </tr>
              </tbody>
              <tfoot class="border-t-2 border-gray-200 pt-2">
                <tr>
                  <td colspan="4" />
                  <td>
                    <span class="text-lg font-bold text-black-2">
                      Total:
                    </span>
                  </td>
                  <td>
                    <span class="text-lg font-bold text-black-2">
                      {{ formatCurrency(selectedSale?.total!) }}
                    </span>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </section>

        <section v-if="selectedTab === 2" class="overflow-hidden">
          <div class="overflow-scroll h-full">
            <table class="table table-sm bg-white rounded-none">
              <!-- head -->
              <thead>
                <tr>
                  <th class="w-12" />
                  <th>Método de pago</th>
                  <th>Fecha de pago</th>
                  <th>Monto</th>
                  <th>Cambio (efectivo)</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(payment, i) in selectedSale?.payments"
                  :key="`sale-row-${payment.id}`"
                  :class="i % 2 === 0 ? 'bg-table-row' : 'bg-white'"
                >
                  <td>
                    <span class="text-sm text-black-3">{{ i + 1 }}</span>
                  </td>
                  <td>{{ getPaymentMethodName(payment.payment_method) }}</td>
                  <td>{{ formatDatetime(payment.created_at) }}</td>
                  <td>{{ formatCurrency(payment.amount) }}</td>
                  <td>{{ payment.change ? formatCurrency(payment.change) : '-' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section class="w-full flex justify-end">
          <!-- <base-button>
            cerrar
          </base-button> -->
        </section>
      </div>
    </div>
  </dialog>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import { IconDotsVertical, IconCopy } from '@tabler/icons-vue'
import { Sale, Response } from '@/api/interfaces'
import { getSalesInTurn } from '@/api/electron'
import { useCurrency } from '@/composables/useCurrency'
import { useDate } from '@/composables/useDate'
import { toast } from 'vue3-toastify'
import { getPaymentMethodName, getSaleStatusName } from '@/utils/Payments'
import { useCashRegister } from '@/composables/useCashRegister'

const { formatDatetimeShort, formatDatetime } = useDate()
const { formatCurrency } = useCurrency()
const { cashRegister } = useCashRegister()

const sales = ref<Sale[]>([])

const emptySales = computed(() => {
  return sales.value.length === 0
})

onMounted(() => {
  if (!cashRegister.value) return
  getSalesInTurn(cashRegister.value.id, (response: Response<Sale[]>) => {
    if (!response.success) {
      toast.error(response.message)
      return
    }
    sales.value = response.response
  })
})

const getBadgeColors = (status: string) => {
  switch (status) {
  case 'pending':
    return 'text-orange-500 bg-orange-100'
  case 'partially_paid':
    return 'text-yellow-500 bg-warning/20'
  case 'paid':
    return 'text-green-500 bg-success/20'
  case 'rejected':
    return 'text-red-500 bg-error/20'
  case 'deleted':
    return 'text-red-500 bg-error/20'
  case 'refunded':
    return 'text-green-500 bg-success/20'
  default:
    return 'text-green-500 bg-success/20'
  }
}

// DIALOG SALE DETAILS
const dialogSaleDetailsRef = ref()
const selectedSale = ref<Sale | null>(null)

const openSaleDetailsModal = (sale: Sale) => {
  selectedSale.value = sale
  dialogSaleDetailsRef.value.showModal()
}

const closeSaleDetailsModal = () => {
  selectedSale.value = null
  dialogSaleDetailsRef.value.close()
}

const copyFolio = () => {
  navigator.clipboard.writeText(selectedSale.value?.folio ?? '')
}

const tabOptions = [
  { id: 1, name: 'Detalles' },
  { id: 2, name: 'Pagos' },
]

const selectedTab = ref(1)
</script>

<style scoped>
.tabs-boxed :is(.tab-active, [aria-selected="true"]):not(.tab-disabled):not([disabled]),
.tabs-boxed :is(input:checked) {
  background-color: var(--soft-blue);
  color: #FFF;
}

.tabs-boxed {
  background-color: var(--white-1);
}

.grid-content {
  height: calc(100% - 48px);
  display: grid;
  grid-template-rows: 132px 40px 1fr 40px;
  row-gap: 8px;
  overflow: hidden;
}
</style>