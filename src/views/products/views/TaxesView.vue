<template>
  <div class="overflow-hidden">
    <header
      class="w-full h-[65px] px-8 bg-white border-b border-gray-200 flex items-center justify-between"
    >
      <h1 class="text-2xl text-black-2 font-medium">
        Impuestos
      </h1>
    </header>

    <TaxTable />
  </div>
</template>

<script lang="ts" setup>
import TaxTable from '../components/TaxTable.vue'
</script>
