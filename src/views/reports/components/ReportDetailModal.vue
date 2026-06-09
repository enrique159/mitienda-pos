<template>
  <dialog class="modal modal-open">
    <div class="modal-box bg-white rounded-lg max-w-2xl">
      <div class="flex items-center justify-between gap-3 mb-4">
        <h3 class="text-lg font-semibold text-black-1">
          Detalle
        </h3>
        <button class="btn btn-sm btn-circle bg-white-1 border-white-3" @click="$emit('close')">
          <IconX size="18" />
        </button>
      </div>
      <div class="grid grid-cols-2 gap-3">
        <div
          v-for="item in detailItems"
          :key="item.key"
          class="rounded-md bg-white-1 border border-white-3 p-3"
        >
          <p class="text-xs text-black-3 mb-1">
            {{ item.label }}
          </p>
          <p class="text-sm text-black-1 break-words">
            {{ item.value }}
          </p>
        </div>
      </div>
    </div>
    <form method="dialog" class="modal-backdrop" @click="$emit('close')">
      <button>cerrar</button>
    </form>
  </dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { IconX } from '@tabler/icons-vue'
import type { ReportTableColumn } from './ReportTable.vue'

const props = defineProps<{
  row: Record<string, any>
  columns: ReportTableColumn[]
}>()

defineEmits<{
  close: []
}>()

const valueFromPath = (row: any, key: string) => key.split('.').reduce((value, path) => value?.[path], row)

const detailItems = computed(() => props.columns.map((column) => {
  const value = valueFromPath(props.row, column.key)
  return {
    key: column.key,
    label: column.label,
    value: column.format ? column.format(value, props.row) : value ?? '',
  }
}))
</script>
