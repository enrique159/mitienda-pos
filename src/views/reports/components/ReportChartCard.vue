<template>
  <section class="bg-white border border-white-3 rounded-lg p-4 shadow-card min-h-[320px]">
    <div class="flex items-start justify-between gap-4 mb-4">
      <div>
        <h2 class="text-lg font-semibold text-black-1">
          {{ title }}
        </h2>
        <p v-if="subtitle" class="text-sm text-black-3 mt-1">
          {{ subtitle }}
        </p>
      </div>
    </div>
    <div v-if="hasData" class="min-h-[240px]">
      <VueApexCharts
        :type="type"
        :height="height"
        :options="options"
        :series="series"
      />
    </div>
    <div v-else class="h-[240px] rounded-lg bg-white-1 border border-dashed border-white-3 grid place-items-center">
      <span class="text-sm text-black-3">Sin datos para mostrar</span>
    </div>
  </section>
</template>

<script setup lang="ts">
import VueApexCharts from 'vue3-apexcharts'

withDefaults(defineProps<{
  title: string
  subtitle?: string
  type: 'line' | 'bar' | 'donut'
  height?: number
  options: Record<string, any>
  series: any[]
  hasData: boolean
}>(), {
  height: 240,
})
</script>
