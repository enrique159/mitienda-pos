<template>
  <ReportTable
    title="Reporte de caja"
    :rows="reportData.tables.cash"
    :columns="columns.cash"
    :export-pdf-loading="isExportingPdf('Reporte de caja').value"
    @view-detail="selectedRow = $event"
    @export-csv="exportCsv('Reporte de caja', reportData.tables.cash, columns.cash)"
    @export-pdf="exportPdf('Reporte de caja', reportData.tables.cash, columns.cash)"
  />
  <ReportDetailModal v-if="selectedRow" :row="selectedRow" :columns="columns.cash" @close="selectedRow = null" />
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
