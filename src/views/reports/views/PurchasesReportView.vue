<template>
  <ReportTable
    title="Compras y proveedores"
    :rows="reportData.tables.purchases"
    :columns="columns.purchases"
    @view-detail="selectedRow = $event"
    @export-csv="exportCsv('Compras y proveedores', reportData.tables.purchases, columns.purchases)"
    @export-pdf="exportPdf('Compras y proveedores', reportData.tables.purchases, columns.purchases)"
  />
  <ReportDetailModal v-if="selectedRow" :row="selectedRow" :columns="columns.purchases" @close="selectedRow = null" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ReportDetailModal from '../components/ReportDetailModal.vue'
import ReportTable from '../components/ReportTable.vue'
import { useReportColumns } from '../utils/reportColumns'
import { useReportExport } from '@/composables/useReportExport'
import { useReports } from '@/composables/useReports'

const selectedRow = ref<Record<string, any> | null>(null)
const { reportData } = useReports()
const columns = useReportColumns()
const { exportCsv, exportPdf } = useReportExport()
</script>
