<template>
  <div
    class="h-4 bg-black/20 rounded-full relative p-1"
    :class="[width]"
  >
    <div
      class="h-full rounded-full min-w-2 transition-all duration-500 ease-in-out"
      :class="[color]"
      :style="{ width: progress + '%'}"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  width: {
    type: String,
    default: 'w-[198px]',
  },
  modelValue: {
    type: Number,
    default: 0,
  },
  color: {
    type: String,
    default: 'bg-brand-orange',
  },
  max: {
    type: Number,
    default: 100,
  },
})

const progress = computed(() => {
  return ((props.modelValue / props.max) * 100).toFixed(2)
})
</script>