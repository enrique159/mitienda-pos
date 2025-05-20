<template>
  <button
    class="px-4 h-10 rounded-md active:scale-95 transition-all text-sm"
    :class="buttonClass"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const { buttonType = 'base' } = defineProps<{
  buttonType?: 'primary' | 'secondary' | 'base'
}>()

const buttonClass = computed(() => {
  switch (buttonType) {
  case 'primary':
    return 'bg-brand-orange hover:bg-brand-orange/80 text-white'
  case 'secondary':
    return 'bg-brand-blue hover:bg-brand-blue/80 text-white'
  case 'base':
    return 'bg-white-2 hover:bg-white-3 text-black-1'
  default:
    return 'bg-white-2 hover:bg-white-3 text-black-1'
  }
})
</script>
