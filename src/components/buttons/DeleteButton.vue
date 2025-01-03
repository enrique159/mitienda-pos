<template>
  <button
    class="delete-button w-24 h-12 text-lg font-bold grid place-items-center bg-contain bg-no-repeat bg-center transition-all"
    :style="{ backgroundImage: 'url(/delete_btn_bg.svg)' }"
    @click="emits('on:click')"
  >
    <slot>
      <icon-X class="ml-1 text-brand-pink" :size="18" stroke-width="3" />
    </slot>
  </button>
</template>

<script setup lang="ts">
import { IconX } from '@tabler/icons-vue'
const emits = defineEmits(['on:click'])
</script>

<style scoped>

</style>