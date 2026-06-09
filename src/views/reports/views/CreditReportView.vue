<template>
  <ReportTable
    title="Creditos y cuentas pendientes"
    :rows="reportData.tables.credits"
    :columns="columns.credits"
    @view-detail="selectedRow = $event"
    @export-csv="exportCsv('Creditos y cuentas pendientes', reportData.tables.credits, columns.credits)"
    @export-pdf="exportPdf('Creditos y cuentas pendientes', reportData.tables.credits, columns.credits)"
  />
  <ReportDetailModal v-if="selectedRow" :row="selectedRow" :columns="columns.credits" @close="selectedRow = null" />
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
