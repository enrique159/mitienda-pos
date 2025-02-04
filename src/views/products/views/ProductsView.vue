<template>
  <div class="overflow-hidden">
    <header
      class="w-full h-[65px] px-8 bg-white border-b border-gray-200 flex items-center justify-between"
    >
      <h1 class="text-2xl text-black-2 font-medium">
        Productos
      </h1>

      <div class="flex items-center gap-4">
        <label
          class="input bg-white-1 border border-white-3 input-sm flex items-center gap-2"
        >
          <input
            v-model="search"
            type="text"
            class="grow"
            placeholder="Buscar producto..."
          >
          <IconSearch class="w-4 h-4 text-black-2" />
        </label>
      </div>
    </header>

    <ProductsTable :search="search" />
  </div>
</template>

<script setup lang="ts">
import ProductsTable from '../components/ProductsTable.vue'
import { IconSearch } from '@tabler/icons-vue'
import { ref } from 'vue'

const search = ref('')
</script>

<style lang="scss" scoped></style>
