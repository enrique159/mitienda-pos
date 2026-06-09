<template>
  <ReportTable
    title="Reporte de ventas"
    :rows="reportData.tables.sales"
    :columns="columns.sales"
    :export-pdf-loading="isExportingPdf('Reporte de ventas').value"
    @view-detail="selectedRow = $event"
    @export-csv="exportCsv('Reporte de ventas', reportData.tables.sales, columns.sales)"
    @export-pdf="exportPdf('Reporte de ventas', reportData.tables.sales, columns.sales)"
  />
  <ReportDetailModal v-if="selectedRow" :row="selectedRow" :columns="columns.sales" @close="selectedRow = null" />
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
const { exportCsv, exportPdf, isExportingPdf } = useReportExport()
</script>
