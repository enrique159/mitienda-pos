<template>
  <div class="space-y-5">
    <div class="grid grid-cols-4 gap-4">
      <ReportMetricCard label="Ventas totales" :value="formatCurrency(data.summary.totalSales)" :icon="IconReceipt" />
      <ReportMetricCard label="Utilidad estimada" :value="formatCurrency(data.summary.estimatedProfit)" :icon="IconTrendingUp" />
      <ReportMetricCard label="Ticket promedio" :value="formatCurrency(data.summary.averageTicket)" :icon="IconChartBar" />
      <ReportMetricCard label="Total de ventas" :value="`${data.summary.salesCount}`" :icon="IconShoppingCart" />
      <ReportMetricCard label="Ventas canceladas" :value="`${data.summary.cancelledSales}`" :icon="IconCircleX" />
      <ReportMetricCard label="Ventas a credito" :value="`${data.summary.creditSales}`" :icon="IconCreditCard" />
      <ReportMetricCard label="Efectivo en caja" :value="formatCurrency(data.summary.cashInRegister)" :icon="IconCash" />
      <ReportMetricCard label="Diferencia de caja" :value="formatCurrency(data.summary.cashDifference)" :icon="IconScale" />
    </div>

    <div class="grid grid-cols-2 gap-4">
      <ReportChartCard
        title="Ventas por dia"
        subtitle="Importe acumulado por fecha"
        type="line"
        :has-data="data.charts.salesByDay.length > 0"
        :series="salesByDaySeries"
        :options="salesByDayOptions"
      />
      <ReportChartCard
        title="Metodo de pago"
        subtitle="Distribucion del cobro"
        type="donut"
        :has-data="data.charts.paymentMethods.some((item) => item.total > 0)"
        :series="paymentMethodSeries"
        :options="paymentMethodOptions"
      />
      <ReportChartCard
        title="Top 10 productos"
        subtitle="Productos con mas unidades vendidas"
        type="bar"
        :has-data="data.charts.topProducts.length > 0"
        :series="topProductsSeries"
        :options="topProductsOptions"
      />
      <ReportChartCard
        title="Ventas por categoria"
        subtitle="Importe acumulado por categoria"
        type="bar"
        :has-data="data.charts.salesByCategory.length > 0"
        :series="categorySeries"
        :options="categoryOptions"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  IconCash,
  IconChartBar,
  IconCircleX,
  IconCreditCard,
  IconReceipt,
  IconScale,
  IconShoppingCart,
  IconTrendingUp,
} from '@tabler/icons-vue'
import { ReportsPayload } from '@/api/interfaces'
import { useCurrency } from '@/composables/useCurrency'
import ReportChartCard from './ReportChartCard.vue'
import ReportMetricCard from './ReportMetricCard.vue'

const props = defineProps<{
  data: ReportsPayload
}>()

const { formatCurrency } = useCurrency()
const chartColors = ['#FF7270', '#E15B73', '#6A81FB', '#5EE3A5']
const moneyFormatter = (value: number) => formatCurrency(value)

const baseOptions = {
  chart: { toolbar: { show: false }, fontFamily: 'Aeonik, system-ui, sans-serif' },
  colors: chartColors,
  dataLabels: { enabled: false },
  stroke: { curve: 'smooth', width: 3 },
  grid: { borderColor: '#EEECEA' },
  tooltip: { y: { formatter: moneyFormatter } },
}

const salesByDaySeries = computed(() => [{
  name: 'Ventas',
  data: props.data.charts.salesByDay.map((item) => item.total),
}])
const salesByDayOptions = computed(() => ({
  ...baseOptions,
  xaxis: { categories: props.data.charts.salesByDay.map((item) => item.date) },
  yaxis: { labels: { formatter: (value: number) => `$${Math.round(value / 100)}` } },
}))

const paymentMethodSeries = computed(() => props.data.charts.paymentMethods.map((item) => item.total))
const paymentMethodOptions = computed(() => ({
  ...baseOptions,
  labels: props.data.charts.paymentMethods.map((item) => paymentMethodLabel(item.method)),
  legend: { position: 'bottom' },
}))

const topProductsSeries = computed(() => [{
  name: 'Unidades',
  data: props.data.charts.topProducts.map((item) => item.quantity),
}])
const topProductsOptions = computed(() => ({
  ...baseOptions,
  plotOptions: { bar: { borderRadius: 5, horizontal: true } },
  xaxis: { categories: props.data.charts.topProducts.map((item) => item.product_name) },
  tooltip: { y: { formatter: (value: number) => `${value} unidades` } },
}))

const categorySeries = computed(() => [{
  name: 'Ventas',
  data: props.data.charts.salesByCategory.map((item) => item.total),
}])
const categoryOptions = computed(() => ({
  ...baseOptions,
  plotOptions: { bar: { borderRadius: 5 } },
  xaxis: { categories: props.data.charts.salesByCategory.map((item) => item.category_name) },
}))

const paymentMethodLabel = (method: string) => ({
  cash: 'Efectivo',
  card: 'Tarjeta',
  transfer: 'Transferencia',
  credit: 'Crédito',
  other: 'Otro',
}[method] || method)
</script>
