<template>
  <div class="overflow-hidden">
    <header
      class="w-full h-[65px] px-8 bg-white border-b border-gray-200 flex items-center justify-between"
    >
      <h1 class="text-2xl text-black-2 font-medium">
        Productos
      </h1>

      <div class="flex items-center gap-4">
        <button
          class="flex items-center gap-2 transition-all duration-200 rounded-md px-2 py-[4px] text-sm font-semibold bg-gradient-to-r from-brand-orange to-brand-blue text-white shadow-md hover:bg-brand-pink custom-shadow"
          @click="showProductAiGeneratorModal = true"
        >
          <IconSparkles size="18" />
          Generar producto
        </button>
        <button
          class="btn btn-sm bg-brand-orange text-white shadow-none hover:bg-brand-pink hover:border-brand-pink"
          @click="$router.push({ name: 'CreateProductView' })"
        >
          <icon-plus class="w-4 h-4" />
          Nuevo producto
        </button>
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

    <ProductAiGeneratorModal v-if="showProductAiGeneratorModal" v-model="showProductAiGeneratorModal" />
  </div>
</template>

<script setup lang="ts">
import ProductAiGeneratorModal from '../components/ProductAiGeneratorModal.vue'
import ProductsTable from '../components/ProductsTable.vue'
import { IconSearch, IconPlus, IconSparkles } from '@tabler/icons-vue'
import { ref } from 'vue'

const search = ref('')
const showProductAiGeneratorModal = ref(false)
</script>

<style scoped>
.custom-shadow:hover {
  box-shadow: 0 4px 15px 0 #ff7270be;
}
</style>
