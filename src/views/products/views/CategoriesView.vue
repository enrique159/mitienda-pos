<template>
  <div class="overflow-hidden">
    <header
      class="w-full h-[65px] px-8 bg-white border-b border-gray-200 flex items-center justify-between"
    >
      <h1 class="text-2xl text-black-2 font-medium">
        Categorías
      </h1>
    </header>

    <categories-table />
  </div>
</template>

<script lang="ts" setup>
import CategoriesTable from '@/views/products/components/CategoriesTable.vue'
</script>

<style>

</style>