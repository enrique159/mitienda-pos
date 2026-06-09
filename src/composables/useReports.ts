import { computed, ref, toRaw } from 'vue'
import { getReports } from '@/api/electron'
import { ReportFilters, ReportsPayload } from '@/api/interfaces'
import { toast } from '@/composables/useToast'

const today = new Date()
const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
const toInputDate = (date: Date) => date.toISOString().slice(0, 10)

const emptyReports: ReportsPayload = {
  summary: {
    totalSales: 0,
    estimatedProfit: 0,
    averageTicket: 0,
    salesCount: 0,
    cancelledSales: 0,
    creditSales: 0,
    cashInRegister: 0,
    cashDifference: 0,
  },
  charts: {
    salesByDay: [],
    paymentMethods: [],
    topProducts: [],
    salesByCategory: [],
  },
  tables: {
    sales: [],
    products: [],
    cash: [],
    credits: [],
    inventory: [],
    inventoryAudits: [],
    purchases: [],
  },
  catalogs: {
    branches: [],
    sellers: [],
    customers: [],
    categories: [],
    products: [],
    providers: [],
  },
}

const reportData = ref<ReportsPayload>(emptyReports)
const loading = ref(false)
const filters = ref<ReportFilters>({
  startDate: toInputDate(startOfMonth),
  endDate: toInputDate(today),
  id_branch: '',
  id_seller: '',
  id_customer: '',
  payment_method: '',
  id_category: '',
  id_product: '',
  search: '',
})

export const useReports = () => {
  const getPlainFilters = () => {
    const currentFilters = toRaw(filters.value)
    return Object.fromEntries(
      Object.entries(currentFilters).filter(([, value]) => value !== undefined && value !== null && value !== '')
    ) as ReportFilters
  }

  const loadReports = async () => {
    loading.value = true
    try {
      const result = await getReports(getPlainFilters())
      loading.value = false
      if (!result.success) {
        toast.error(result.message)
        return
      }
      reportData.value = result.response
    } catch (error) {
      loading.value = false
      toast.error(error instanceof Error ? error.message : 'Error al cargar reportes')
    }
  }

  const resetFilters = () => {
    filters.value = {
      startDate: toInputDate(startOfMonth),
      endDate: toInputDate(today),
      id_branch: '',
      id_seller: '',
      id_customer: '',
      payment_method: '',
      id_category: '',
      id_product: '',
      search: '',
    }
    loadReports()
  }

  return {
    reportData: computed(() => reportData.value),
    filters,
    loading: computed(() => loading.value),
    loadReports,
    resetFilters,
  }
}
