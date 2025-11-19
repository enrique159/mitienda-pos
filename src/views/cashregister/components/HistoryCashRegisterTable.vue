<template>
  <div class="overflow-auto h-table">
    <table class="table table-sm bg-white rounded-none">
      <!-- head -->
      <thead>
        <tr>
          <th class="w-12" />
          <th>Fecha de apertura</th>
          <th>Fecha de corte</th>
          <th>Abierto por</th>
          <th>Cerrado por</th>
          <th>Saldo al corte</th>
          <th>Tipo</th>
          <th class="w-12" />
          <th class="w-12" />
        </tr>
      </thead>
      <tbody>
        <tr v-for="(cashRegisterAudit, i) in filteredCashRegisterAudits"
          :key="`cash-register-audit-row-${cashRegisterAudit.id}`" :class="i % 2 === 0 ? 'bg-table-row' : 'bg-white'">
          <td>
            <span class="text-sm text-black-3">{{ i + 1 }}</span>
          </td>
          <td>{{ formatDatetimeShort(cashRegisterAudit.opening_date) }}</td>
          <td>{{ formatDatetimeShort(cashRegisterAudit.created_at) }}</td>
          <td>{{ cashRegisterAudit.opening_user_name }}</td>
          <td>{{ cashRegisterAudit.closing_user_name }}</td>
          <td>{{ formatCurrency(cashRegisterAudit.balance) }}</td>
          <td>
            <div class="badge" :class="cashRegisterAudit.closure === 'partial'
              ? 'badge-warning'
              : 'badge-success text-white'
              ">
              {{
                cashRegisterAudit.closure === 'partial' ? 'Parcial' : 'Completo'
              }}
            </div>
          </td>
          <td>
            <div class="tooltip tooltip-left" data-tip="Ver detalles">
              <button class="btn w-8 h-8 btn-xs rounded-full aspect-square grid place-items-center"
                @click="goToCashRegisterDetails(cashRegisterAudit.id)">
                <IconEye class="w-4 h-4" />
              </button>
            </div>
          </td>
          <td>
            <div class="tooltip tooltip-left" data-tip="Imprimir reporte">
              <button class="btn w-8 h-8 btn-xs rounded-full aspect-square grid place-items-center"
                @click="printCashRegisterReport(cashRegisterAudit)">
                <IconPdf class="w-4 h-4" />
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import {
  getCashRegisterAudits,
  printCloseCashRegisterReportTicket,
} from '@/api/electron'
import { useDate } from '@/composables/useDate'
import { toast } from '@/composables/useToast'
import { Response, CashRegisterAuditDetail } from '@/api/interfaces'
import { useCurrency } from '@/composables/useCurrency'
import { IconEye, IconPdf } from '@tabler/icons-vue'
import { useRouter } from 'vue-router'
import { useBranch } from '@/composables/useBranch'

const router = useRouter()
const { formatDatetimeShort } = useDate()
const { formatCurrency } = useCurrency()
const { branch } = useBranch()

const props = defineProps<{
  search: String
}>()

const cashRegisterAudits = ref<CashRegisterAuditDetail[]>([])

const filteredCashRegisterAudits = computed(() => {
  return cashRegisterAudits.value.filter(
    (cashRegisterAudit: CashRegisterAuditDetail) => {
      return (
        cashRegisterAudit.opening_user_name
          .toLowerCase()
          .includes(props.search.toLowerCase()) ||
        cashRegisterAudit.closing_user_name
          .toLowerCase()
          .includes(props.search.toLowerCase())
      )
    }
  )
})

const getAllCashRegisterAudits = () => {
  getCashRegisterAudits()
    .then((response: Response<CashRegisterAuditDetail[]>) => {
      if (!response.success) {
        toast.error(response.message)
        return
      }
      cashRegisterAudits.value = response.response
    })
    .catch((error) => {
      console.error(error)
      toast.error(error.message)
    })
}

getAllCashRegisterAudits()

const goToCashRegisterDetails = (id: string) => {
  router.push({ name: 'CashRegisterDetails', params: { id } })
}

const printCashRegisterReport = (cashRegisterAudit: CashRegisterAuditDetail) => {
  const payload = {
    branch: {
      logo: branch.value.logo,
      name: branch.value.branch_name,
      alias: branch.value.branch_alias,
    },
    cashRegister: {
      ...cashRegisterAudit,
    },
  }
  printCloseCashRegisterReportTicket(payload, (response: Response<any>) => {
    if (!response.success) {
      toast.error(response.message)
      return
    }
    toast.success(response.message)
  })
}
</script>
