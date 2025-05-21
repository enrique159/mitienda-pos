<template>
  <div class="flex flex-col">
    <span v-for="error in errors" :key="error.$uid" class="text-sm text-red-400">
      {{ error.$message }}
    </span>
  </div>
</template>

<script setup lang="ts">
defineProps<{ errors: any }>()
</script>

<style lang="scss" scoped>

</style>