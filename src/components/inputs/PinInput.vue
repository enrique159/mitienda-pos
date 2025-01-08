<template>
  <div class="grid grid-cols-3 gap-2 max-w-[260px]">
    <button
      v-for="(digit, index) in digits"
      :key="`pin-button-${index}`"
      class="w-20 h-20 aspect-square rounded-full bg-white-3 transition-all text-lg font-bold"
      :class="[
        digit === '.' && dotDisabled
          ? 'opacity-50 cursor-not-allowed'
          : 'active:bg-black-3',
      ]"
      :disabled="digit === '.' && dotDisabled"
      @click="emits('input', digit)"
    >
      {{ digit }}
    </button>

    <button
      class="w-20 h-20 aspect-square rounded-full bg-brand-black active:bg-black-2 text-brand-white transition-all text-lg font-bold grid place-items-center"
      @click="emits('enter')"
    >
      <icon-corner-down-left />
    </button>
  </div>
</template>

<script setup lang="ts">
import { IconCornerDownLeft } from '@tabler/icons-vue'
const emits = defineEmits(['input', 'enter'])
const props = defineProps<{
  dotDisabled?: boolean
}>()
const digits = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0']
</script>

<style scoped></style>
