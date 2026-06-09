<template>
  <article class="bg-white border border-white-3 rounded-lg p-4 shadow-card min-h-[116px] flex flex-col justify-between">
    <div class="flex items-start justify-between gap-3">
      <div>
        <p class="text-sm text-black-3">
          {{ label }}
        </p>
        <p class="mt-2 text-2xl font-bold text-black-1 leading-tight">
          {{ value }}
        </p>
      </div>
      <div class="w-10 h-10 rounded-lg bg-brand-white text-brand-orange grid place-items-center">
        <component :is="icon" size="20" stroke-width="2" />
      </div>
    </div>
    <p v-if="helper" class="text-xs text-black-3 mt-3">
      {{ helper }}
    </p>
  </article>
</template>

<script setup lang="ts">
defineProps<{
  label: string
  value: string
  helper?: string
  icon: any
}>()
</script>
