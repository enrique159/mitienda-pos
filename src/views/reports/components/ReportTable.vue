<template>
  <section class="bg-white border border-white-3 rounded-lg overflow-hidden shadow-card">
    <div class="min-h-[64px] px-4 py-3 border-b border-white-3 flex items-center justify-between gap-3">
      <div>
        <h2 class="text-lg font-semibold text-black-1">
          {{ title }}
        </h2>
        <p class="text-sm text-black-3">
          {{ rows.length }} registros
        </p>
      </div>
      <div class="flex items-center gap-2">
        <button class="btn btn-sm bg-white-1 border-white-3 text-black-1 hover:bg-white-2" @click="$emit('export-pdf')">
          <IconFileTypePdf size="17" />
          PDF
        </button>
        <button class="btn btn-sm bg-brand-orange text-white border-brand-orange hover:bg-brand-pink hover:border-brand-pink" @click="$emit('export-csv')">
          <IconFileSpreadsheet size="17" />
          Excel/CSV
        </button>
      </div>
    </div>

    <div class="overflow-auto max-h-[520px]">
      <table class="table table-sm">
        <thead class="sticky top-0 bg-white z-[1]">
          <tr>
            <th v-for="column in columns" :key="column.key">
              {{ column.label }}
            </th>
            <th v-if="showDetail" class="w-12" />
          </tr>
        </thead>
        <tbody>
          <tr v-if="!rows.length">
            <td :colspan="columns.length + (showDetail ? 1 : 0)" class="text-center text-black-3 py-10">
              No hay registros con los filtros actuales
            </td>
          </tr>
          <tr
            v-for="(row, index) in rows"
            :key="row.id || row.id_product || index"
            :class="index % 2 === 0 ? 'bg-table-row' : 'bg-white'"
          >
            <td v-for="column in columns" :key="column.key">
              {{ formatCell(row, column) }}
            </td>
            <td v-if="showDetail">
              <button class="btn btn-xs bg-white-1 border-white-3 hover:bg-white-2" @click="$emit('view-detail', row)">
                <IconEye size="16" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<script setup lang="ts">
import { IconEye, IconFileSpreadsheet, IconFileTypePdf } from '@tabler/icons-vue'

export type ReportTableColumn = {
  key: string
  label: string
  format?: (value: any, row: any) => string
}

withDefaults(defineProps<{
  title: string
  rows: any[]
  columns: ReportTableColumn[]
  showDetail?: boolean
}>(), {
  showDetail: true,
})

defineEmits<{
  'view-detail': [row: any]
  'export-csv': []
  'export-pdf': []
}>()

const valueFromPath = (row: any, key: string) => key.split('.').reduce((value, path) => value?.[path], row)

const formatCell = (row: any, column: ReportTableColumn) => {
  const value = valueFromPath(row, column.key)
  if (column.format) return column.format(value, row)
  return value ?? ''
}
</script>
