<template>
  <button
    class="px-4 h-10 rounded-md active:scale-95 transition-all text-sm"
    :class="[
      buttonClass,
      disabled && 'disabled:opacity-50 disabled:cursor-default disabled:active:scale-100',
    ]"
    :disabled="disabled"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  buttonType?: 'primary' | 'secondary' | 'base'
  disabled?: boolean
}>()

const buttonClass = computed(() => {
  switch (props.buttonType) {
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
