<template>
  <ReportTable
    title="Reporte por productos"
    :rows="reportData.tables.products"
    :columns="columns.products"
    :export-pdf-loading="isExportingPdf('Reporte por productos').value"
    @view-detail="selectedRow = $event"
    @export-csv="exportCsv('Reporte por productos', reportData.tables.products, columns.products)"
    @export-pdf="exportPdf('Reporte por productos', reportData.tables.products, columns.products)"
  />
  <ReportDetailModal v-if="selectedRow" :row="selectedRow" :columns="columns.products" @close="selectedRow = null" />
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
