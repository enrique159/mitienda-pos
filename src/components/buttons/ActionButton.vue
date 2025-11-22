<template>
  <button
    class="btn w-8 min-w-8 aspect-square h-8 btn-xs rounded-full grid place-items-center cursor-pointer"
    @click="emits('on:click')"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
const emits = defineEmits(['on:click'])
</script>
