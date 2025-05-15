<template>
  <div class="overflow-hidden">
    <header class="w-full h-[65px] px-8 bg-white border-b border-gray-200 flex items-center justify-between">
      <h1 class="text-2xl text-black-2 font-medium">
        Pedidos
      </h1>
      <div class="flex items-center gap-4">
        <button
          class="btn btn-sm bg-brand-orange text-white shadow-none hover:bg-brand-pink hover:border-brand-pink"
          @click="$router.push('/main/orders/create')"
        >
          <icon-plus class="w-4 h-4" />
          Nuevo pedido
        </button>
        <label
          class="input bg-white-1 border border-white-3 input-sm flex items-center gap-2"
        >
          <input
            v-model="search"
            type="text"
            class="grow"
            placeholder="Buscar pedido..."
          >
          <IconSearch class="w-4 h-4 text-black-2" />
        </label>
      </div>
    </header>

    <orders-table :search="search" />
  </div>
</template>

<script lang="ts" setup>
import OrdersTable from '../components/OrdersTable.vue'
import { IconSearch, IconPlus } from '@tabler/icons-vue'
import { ref } from 'vue'

const search = ref('')
</script>
