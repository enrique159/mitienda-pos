<template>
  <section class="bg-white border border-white-3 rounded-lg p-4 shadow-card">
    <div class="grid grid-cols-7 gap-3 items-end">
      <label class="form-control">
        <span class="label-text text-black-2">Desde</span>
        <input v-model="model.startDate" type="date" class="input input-sm bg-white-1 border-white-3">
      </label>
      <label class="form-control">
        <span class="label-text text-black-2">Hasta</span>
        <input v-model="model.endDate" type="date" class="input input-sm bg-white-1 border-white-3">
      </label>
      <label class="form-control">
        <span class="label-text text-black-2">Sucursal</span>
        <select v-model="model.id_branch" class="select select-sm bg-white-1 border-white-3">
          <option value="">Todas</option>
          <option v-for="item in catalogs.branches" :key="item.id" :value="item.id">{{ item.name }}</option>
        </select>
      </label>
      <label class="form-control">
        <span class="label-text text-black-2">Vendedor</span>
        <select v-model="model.id_seller" class="select select-sm bg-white-1 border-white-3">
          <option value="">Todos</option>
          <option v-for="item in catalogs.sellers" :key="item.id" :value="item.id">{{ item.name }}</option>
        </select>
      </label>
      <label class="form-control">
        <span class="label-text text-black-2">Cliente</span>
        <select v-model="model.id_customer" class="select select-sm bg-white-1 border-white-3">
          <option value="">Todos</option>
          <option v-for="item in catalogs.customers" :key="item.id" :value="item.id">{{ item.name }}</option>
        </select>
      </label>
      <label class="form-control">
        <span class="label-text text-black-2">Pago</span>
        <select v-model="model.payment_method" class="select select-sm bg-white-1 border-white-3">
          <option value="">Todos</option>
          <option value="cash">Efectivo</option>
          <option value="card">Tarjeta</option>
          <option value="transfer">Transferencia</option>
          <option value="other">Otro</option>
        </select>
      </label>
      <div class="flex items-center gap-2">
        <button class="btn btn-sm flex-1 bg-brand-orange text-white border-brand-orange hover:bg-brand-pink hover:border-brand-pink" @click="$emit('apply')">
          <IconFilter size="17" />
          Filtrar
        </button>
      </div>
      <label class="form-control col-span-2">
        <span class="label-text text-black-2">Categoria</span>
        <select v-model="model.id_category" class="select select-sm bg-white-1 border-white-3">
          <option value="">Todas</option>
          <option v-for="item in catalogs.categories" :key="item.id" :value="item.id">{{ item.name }}</option>
        </select>
      </label>
      <label class="form-control col-span-2">
        <span class="label-text text-black-2">Producto</span>
        <select v-model="model.id_product" class="select select-sm bg-white-1 border-white-3">
          <option value="">Todos</option>
          <option v-for="item in filteredProducts" :key="item.id" :value="item.id">{{ item.name }}</option>
        </select>
      </label>
      <label class="form-control col-span-2">
        <span class="label-text text-black-2">Buscar</span>
        <input v-model="model.search" type="text" placeholder="Folio, cliente o vendedor" class="input input-sm bg-white-1 border-white-3">
      </label>
      <button class="btn btn-sm bg-white-1 border-white-3 text-black-1 hover:bg-white-2" @click="$emit('reset')">
        <IconRefresh size="17" />
        Limpiar
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { IconFilter, IconRefresh } from '@tabler/icons-vue'
import { ReportCatalogOption, ReportFilters } from '@/api/interfaces'

const model = defineModel<ReportFilters>({ required: true })

const props = defineProps<{
  catalogs: {
    branches: ReportCatalogOption[]
    sellers: ReportCatalogOption[]
    customers: ReportCatalogOption[]
    categories: ReportCatalogOption[]
    products: ReportCatalogOption[]
  }
}>()

defineEmits<{
  apply: []
  reset: []
}>()

const filteredProducts = computed(() => {
  if (!model.value.id_category) return props.catalogs.products
  return props.catalogs.products.filter((product) => product.id_category === model.value.id_category)
})
</script>
