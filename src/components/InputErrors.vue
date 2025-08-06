<template>
  <div class="flex flex-col pl-2">
    <span v-for="error in errors" :key="error.$uid" class="text-sm" :class="textColor">
      {{ error.$message }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{ errors: any, textColor?: string }>()

const textColor = computed(() => props.textColor || 'text-red-400')
</script>

<style lang="scss" scoped>

</style>