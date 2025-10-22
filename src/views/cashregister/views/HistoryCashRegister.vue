<template>
  <div class="overflow-hidden">
    <header class="w-full h-[65px] px-8 bg-white border-b border-gray-200 flex items-center justify-between">
      <h1 class="text-2xl text-black-2 font-medium">
        Historial de cajas
      </h1>
      <div class="flex items-center gap-4">
        <label
          class="input bg-white-1 border border-white-3 input-sm flex items-center gap-2"
        >
          <input
            v-model="search"
            type="text"
            class="grow"
            placeholder="Buscar caja..."
          >
          <IconSearch class="w-4 h-4 text-black-2" />
        </label>
      </div>
    </header>

    <HistoryCashRegisterTable :search="search" />
  </div>
</template>

<script lang="ts" setup>
import { IconSearch } from '@tabler/icons-vue'
import HistoryCashRegisterTable from '../components/HistoryCashRegisterTable.vue'
import { ref } from 'vue'

const search = ref('')
</script>
