<template>
  <div class="space-y-4">
    <ReportTable
      title="Inventario actual"
      :rows="reportData.tables.inventory"
      :columns="columns.inventory"
      @view-detail="selectedRow = $event"
      @export-csv="exportCsv('Inventario actual', reportData.tables.inventory, columns.inventory)"
      @export-pdf="exportPdf('Inventario actual', reportData.tables.inventory, columns.inventory)"
    />
    <ReportTable
      title="Conteos de inventario"
      :rows="reportData.tables.inventoryAudits"
      :columns="columns.inventoryAudits"
      @view-detail="selectedRow = $event"
      @export-csv="exportCsv('Conteos de inventario', reportData.tables.inventoryAudits, columns.inventoryAudits)"
      @export-pdf="exportPdf('Conteos de inventario', reportData.tables.inventoryAudits, columns.inventoryAudits)"
    />
  </div>
  <ReportDetailModal v-if="selectedRow" :row="selectedRow" :columns="detailColumns" @close="selectedRow = null" />
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import ReportDetailModal from '../components/ReportDetailModal.vue'
import ReportTable from '../components/ReportTable.vue'
import { useReportColumns } from '../utils/reportColumns'
import { useReportExport } from '@/composables/useReportExport'
import { useReports } from '@/composables/useReports'

const selectedRow = ref<Record<string, any> | null>(null)
const { reportData } = useReports()
const columns = useReportColumns()
const { exportCsv, exportPdf } = useReportExport()
const detailColumns = computed(() => selectedRow.value?.items_count === undefined ? columns.inventory : columns.inventoryAudits)
</script>
