<template>
  <section class="bg-white border border-white-3 rounded-lg p-5 shadow-card">
    <h2 class="text-xl font-semibold text-black-1">
      Exportaciones
    </h2>
    <p class="text-sm text-black-3 mt-1">
      Descarga los reportes principales con los filtros actuales.
    </p>

    <div class="grid grid-cols-2 gap-3 mt-5">
      <button
        v-for="item in exportItems"
        :key="item.title"
        class="h-20 rounded-lg border border-white-3 bg-white-1 hover:bg-white-2 active:scale-[0.98] transition-all px-4 flex items-center justify-between text-left"
        @click="item.action"
      >
        <span>
          <span class="block text-base font-semibold text-black-1">{{ item.title }}</span>
          <span class="block text-sm text-black-3">{{ item.rows }} registros</span>
        </span>
        <IconDownload class="text-brand-orange" size="22" />
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { IconDownload } from '@tabler/icons-vue'
import { useReportColumns } from '../utils/reportColumns'
import { useReportExport } from '@/composables/useReportExport'
import { useReports } from '@/composables/useReports'

const { reportData } = useReports()
const columns = useReportColumns()
const { exportCsv } = useReportExport()

const exportItems = computed(() => [
  { title: 'Ventas', rows: reportData.value.tables.sales.length, action: () => exportCsv('Reporte de ventas', reportData.value.tables.sales, columns.sales) },
  { title: 'Productos', rows: reportData.value.tables.products.length, action: () => exportCsv('Reporte por productos', reportData.value.tables.products, columns.products) },
  { title: 'Caja', rows: reportData.value.tables.cash.length, action: () => exportCsv('Reporte de caja', reportData.value.tables.cash, columns.cash) },
  { title: 'Creditos', rows: reportData.value.tables.credits.length, action: () => exportCsv('Creditos y cuentas pendientes', reportData.value.tables.credits, columns.credits) },
  { title: 'Inventario', rows: reportData.value.tables.inventory.length, action: () => exportCsv('Inventario actual', reportData.value.tables.inventory, columns.inventory) },
  { title: 'Compras', rows: reportData.value.tables.purchases.length, action: () => exportCsv('Compras y proveedores', reportData.value.tables.purchases, columns.purchases) },
])
</script>
