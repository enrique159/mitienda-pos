<template>
  <div class="w-fit flex items-center gap-4 relative">
    <div
      v-for="(step, index) in steps"
      :key="`step-${index}`"
      class="w-fit py-2 px-4 rounded-full text-sm"
      :class="{
        'bg-brand-white text-brand-black font-bold': index === activeStep,
        'bg-success text-white-1': index < activeStep,
        'bg-black/10 text-white-1': index > activeStep,
      }"
    >
      {{ step }}
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  steps: {
    type: Array as () => string[],
    required: true,
  },
  activeStep: {
    type: Number,
    required: true,
  },
})
</script>

<style lang="scss" scoped>

</style>