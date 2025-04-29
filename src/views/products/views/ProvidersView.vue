<template>
  <div class="overflow-hidden">
    <header class="w-full h-[65px] px-8 bg-white border-b border-gray-200 flex items-center justify-between">
      <h1 class="text-2xl text-black-2 font-medium">
        Proveedores
      </h1>
      <div class="flex items-center gap-4">
        <button
          class="btn btn-sm bg-brand-orange text-white shadow-none hover:bg-brand-pink hover:border-brand-pink"
          @click="show = true"
        >
          <icon-plus class="w-4 h-4" />
          Nuevo proveedor
        </button>
        <label
          class="input bg-white-1 border border-white-3 input-sm flex items-center gap-2"
        >
          <input
            v-model="search"
            type="text"
            class="grow"
            placeholder="Buscar proveedor..."
          >
          <IconSearch class="w-4 h-4 text-black-2" />
        </label>
      </div>
    </header>

    <providers-table :search="search" />

    <create-provider-modal v-model="show" />
  </div>
</template>

<script lang="ts" setup>
import ProvidersTable from '../components/ProvidersTable.vue'
import CreateProviderModal from '../components/CreateProviderModal.vue'
import { IconPlus, IconSearch } from '@tabler/icons-vue'
import { ref } from 'vue'

const show = ref(false)

const search = ref('')
</script>
