<template>
  <button
    class="btn w-8 min-w-8 aspect-square h-8 btn-xs rounded-full grid place-items-center cursor-pointer"
    :disabled="disabled || loading"
    :aria-busy="loading"
    @click="emits('on:click')"
  >
    <span v-if="loading" class="loading loading-spinner loading-xs" />
    <slot v-else />
  </button>
</template>

<script setup lang="ts">
defineProps<{
  disabled?: boolean
  loading?: boolean
}>()

const emits = defineEmits(['on:click'])
</script>
