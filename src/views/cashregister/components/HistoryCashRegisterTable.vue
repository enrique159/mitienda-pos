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
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(cashRegisterAudit, i) in filteredCashRegisterAudits"
          :key="`cash-register-audit-row-${cashRegisterAudit.id}`"
          :class="i % 2 === 0 ? 'bg-table-row' : 'bg-white'"
        >
          <td>
            <span class="text-sm text-black-3">{{ i + 1 }}</span>
          </td>
          <td>{{ formatDatetimeShort(cashRegisterAudit.opening_date) }}</td>
          <td>{{ formatDatetimeShort(cashRegisterAudit.created_at) }}</td>
          <td>{{ cashRegisterAudit.opening_user_name }}</td>
          <td>{{ cashRegisterAudit.closing_user_name }}</td>
          <td>{{ formatCurrency(cashRegisterAudit.balance) }}</td>
          <td>
            <div
              class="badge"
              :class="
                cashRegisterAudit.closure === 'partial'
                  ? 'badge-warning'
                  : 'badge-success text-white'
              "
            >
              {{
                cashRegisterAudit.closure === 'partial' ? 'Parcial' : 'Completo'
              }}
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { getCashRegisterAudits } from '@/api/electron'
import { useDate } from '@/composables/useDate'
import { toast } from '@/composables/useToast'
import { Response, CashRegisterAuditDetail } from '@/api/interfaces'
import { useCurrency } from '@/composables/useCurrency'

const { formatDatetimeShort } = useDate()
const { formatCurrency } = useCurrency()

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
</script>
