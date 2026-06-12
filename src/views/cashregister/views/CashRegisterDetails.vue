<template>
  <div
    class="p-8 pt-4 h-full w-full overflow-y-auto max-w-[1080px] mx-auto space-y-4"
  >
    <header class="flex justify-between items-center gap-2">
      <div class="flex items-center gap-2">
        <button
          class="btn btn-sm btn-ghost btn-circle"
          @click="router.push({ name: 'HistoryCashRegister' })"
        >
          <IconArrowLeft size="24" />
        </button>
        <h6 class="text-2xl font-bold">Detalles del cierre de caja</h6>
        <span
          v-if="cashRegisterAudit"
          class="badge badge-lg"
          :class="closureBadgeClass"
        >
          {{ closureLabel }}
        </span>
      </div>
    </header>

    <div
      v-if="loading"
      class="bg-white rounded-lg p-8 text-center text-black-3"
    >
      Cargando detalles del cierre...
    </div>

    <div
      v-else-if="!cashRegisterAudit"
      class="bg-white rounded-lg p-8 text-center text-black-3"
    >
      No se encontró el cierre de caja solicitado
    </div>

    <template v-else>
      <section id="cash-register-details" class="grid grid-cols-4 gap-4">
        <div>
          <p class="text-sm text-black-3">Abierto por:</p>
          <p class="font-medium">
            {{ cashRegisterAudit.opening_user_name || '-' }}
          </p>
        </div>
        <div>
          <p class="text-sm text-black-3">Cerrado por:</p>
          <p class="font-medium">
            {{ cashRegisterAudit.closing_user_name || '-' }}
          </p>
        </div>
        <div>
          <p class="text-sm text-black-3">Fecha de apertura:</p>
          <p class="font-medium">
            {{ formatDatetimeShort(cashRegisterAudit.opening_date) || '-' }}
          </p>
        </div>
        <div>
          <p class="text-sm text-black-3">Fecha de cierre:</p>
          <p class="font-medium">
            {{ formatDatetimeShort(cashRegisterAudit.created_at) || '-' }}
          </p>
        </div>
        <div>
          <p class="text-sm text-black-3">Ventas:</p>
          <p class="font-medium">{{ cashRegisterAudit.count_sales }}</p>
        </div>
        <div>
          <p class="text-sm text-black-3">Movimientos:</p>
          <p class="font-medium">{{ cashRegisterAudit.count_movements }}</p>
        </div>
        <div>
          <p class="text-sm text-black-3">Monto de apertura:</p>
          <p class="font-medium">
            {{ formatCurrency(cashRegisterAudit.opening_amount || 0) }}
          </p>
        </div>
        <div>
          <p class="text-sm text-black-3">Diferencia:</p>
          <p class="font-medium" :class="differenceClass">
            {{ formatSignedCurrency(cashRegisterAudit.difference) }}
          </p>
        </div>
      </section>

      <section class="grid grid-cols-2 gap-4">
        <div class="bg-white rounded-lg p-4 space-y-3">
          <h6 class="font-bold text-black-2">Resumen registrado</h6>
          <div class="space-y-2">
            <summary-row
              label="Ventas en efectivo"
              :value="formatCurrency(cashRegisterAudit.cash_amount)"
            />
            <summary-row
              label="Ventas con tarjeta"
              :value="formatCurrency(cashRegisterAudit.card_amount)"
            />
            <summary-row
              label="Ventas por transferencia"
              :value="formatCurrency(cashRegisterAudit.transfer_amount)"
            />
            <summary-row
              label="Ventas de otros medios"
              :value="formatCurrency(cashRegisterAudit.other_amount)"
            />
            <summary-row
              label="Ingresos"
              :value="formatCurrency(cashRegisterAudit.income)"
            />
            <summary-row
              label="Retiros"
              :value="formatCurrency(cashRegisterAudit.withdraw)"
            />
          </div>
        </div>

        <div class="bg-white rounded-lg p-4 space-y-3">
          <h6 class="font-bold text-black-2">Totales del cierre</h6>
          <div class="space-y-2">
            <summary-row
              label="Efectivo esperado"
              :value="formatCurrency(expectedCashAmount)"
            />
            <summary-row
              label="Efectivo contado"
              :value="formatCurrency(cashBreakdownTotal)"
            />
            <summary-row
              label="Tarjeta contada"
              :value="formatCurrency(cashRegisterAudit.card_breakdown || 0)"
            />
            <summary-row
              label="Total registrado"
              :value="formatCurrency(cashRegisterAudit.total_amount)"
            />
            <summary-row
              label="Balance contado"
              :value="formatCurrency(cashRegisterAudit.balance)"
            />
            <summary-row
              label="Diferencia"
              :value="formatSignedCurrency(cashRegisterAudit.difference)"
              :value-class="differenceClass"
            />
          </div>
        </div>
      </section>

      <section class="space-y-4 pb-12">
        <div class="collapse bg-white">
          <input v-model="isBreakdownOpen" type="checkbox" />
          <div
            class="collapse-title font-medium flex justify-between items-center pr-6"
          >
            <p class="inline-flex items-center gap-2">
              <IconInfoCircle size="24" class="text-brand-blue" />
              Desglose de efectivo
            </p>
            <IconChevronDown
              size="24"
              class="transition-transform duration-300"
              :class="{ 'rotate-180': isBreakdownOpen }"
            />
          </div>
          <div class="collapse-content">
            <table class="table table-sm">
              <thead>
                <tr>
                  <th>Denominación</th>
                  <th>Tipo</th>
                  <th>Cantidad</th>
                  <th class="text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="denomination in cashBreakdown"
                  :key="`cash-breakdown-${denomination.type}-${denomination.denomination}`"
                >
                  <td>
                    {{ formatCurrency(Number(denomination.denomination)) }}
                  </td>
                  <td>
                    {{ denomination.type === 'coin' ? 'Moneda' : 'Billete' }}
                  </td>
                  <td>{{ denomination.quantity }}</td>
                  <td class="text-right">
                    {{
                      formatCurrency(
                        Number(denomination.denomination) *
                          denomination.quantity
                      )
                    }}
                  </td>
                </tr>
                <tr v-if="cashBreakdown.length === 0">
                  <td colspan="4" class="text-center text-black-3 py-8">
                    Sin desglose de efectivo registrado
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, defineComponent, h, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  IconArrowLeft,
  IconChevronDown,
  IconInfoCircle,
} from '@tabler/icons-vue'
import { getCashRegisterAudits } from '@/api/electron'
import {
  CashRegisterAuditDetail,
  Denomination,
  Response,
} from '@/api/interfaces'
import { Closure } from '@/api/interfaces/cashRegisterAudits'
import { useCurrency } from '@/composables/useCurrency'
import { useDate } from '@/composables/useDate'
import { toast } from '@/composables/useToast'

const router = useRouter()
const route = useRoute()
const { formatCurrency } = useCurrency()
const { formatDatetimeShort } = useDate()

const loading = ref(true)
const isBreakdownOpen = ref(true)
const cashRegisterAudit = ref<CashRegisterAuditDetail | null>(null)

const auditId = computed(() => String(route.params.id || ''))

const closureLabel = computed(() =>
  cashRegisterAudit.value?.closure === Closure.Full ? 'Completo' : 'Parcial'
)

const closureBadgeClass = computed(() =>
  cashRegisterAudit.value?.closure === Closure.Full
    ? 'badge-success text-white'
    : 'badge-warning'
)

const differenceClass = computed(() => {
  if (!cashRegisterAudit.value || cashRegisterAudit.value.difference === 0) {
    return 'text-black-1'
  }
  return cashRegisterAudit.value.difference > 0
    ? 'text-info'
    : 'text-brand-pink'
})

const cashBreakdown = computed<Denomination[]>(() => {
  const breakdown = cashRegisterAudit.value?.cash_breakdown
  if (!breakdown) return []

  if (typeof breakdown === 'string') {
    try {
      const parsed = JSON.parse(breakdown)
      return Array.isArray(parsed) ? parsed : []
    } catch (error) {
      console.error(error)
      return []
    }
  }

  return Array.isArray(breakdown) ? breakdown : []
})

const cashBreakdownTotal = computed(() =>
  cashBreakdown.value.reduce((total, denomination) => {
    return total + Number(denomination.denomination) * denomination.quantity
  }, 0)
)

const expectedCashAmount = computed(() => {
  if (!cashRegisterAudit.value) return 0
  return (
    (cashRegisterAudit.value.opening_amount || 0) +
    cashRegisterAudit.value.cash_amount +
    cashRegisterAudit.value.income -
    cashRegisterAudit.value.withdraw
  )
})

const formatSignedCurrency = (value: number) => {
  if (value === 0) return formatCurrency(value)
  return `${value > 0 ? '+' : '-'}${formatCurrency(Math.abs(value))}`
}

const getCashRegisterAudit = async () => {
  loading.value = true
  try {
    const response: Response<CashRegisterAuditDetail[]> =
      await getCashRegisterAudits()
    if (!response.success) {
      toast.error(response.message)
      return
    }

    cashRegisterAudit.value =
      response.response.find((audit) => audit.id === auditId.value) || null
  } catch (error) {
    console.error(error)
    toast.error('No se pudieron obtener los detalles del cierre de caja')
  } finally {
    loading.value = false
  }
}

const SummaryRow = defineComponent({
  props: {
    label: {
      type: String,
      required: true,
    },
    value: {
      type: String,
      required: true,
    },
    valueClass: {
      type: String,
      default: 'text-black-2',
    },
  },
  setup(props) {
    return () =>
      h('div', { class: 'flex items-center justify-between gap-2' }, [
        h('span', { class: 'text-black-2 text-sm text-nowrap' }, props.label),
        h('div', {
          class: 'mx-2 border-b border-dotted border-black-2 w-full',
        }),
        h(
          'span',
          {
            class: [
              'text-sm font-medium text-right text-nowrap',
              props.valueClass,
            ],
          },
          props.value
        ),
      ])
  },
})

onMounted(getCashRegisterAudit)
</script>
