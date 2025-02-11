<template>
  <div class="overflow-hidden">
    <header
      class="w-full h-[65px] px-8 bg-white border-b border-gray-200 flex items-center justify-between"
    >
      <h1 class="text-2xl text-black-2 font-medium">
        Ventas
      </h1>
    </header>

    <list-sales-table />
  </div>
</template>

<script lang="ts" setup>
import ListSalesTable from '@/views/listsales/components/ListSalesTable.vue'
</script>