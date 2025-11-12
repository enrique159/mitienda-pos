<template>
  <div class="overflow-hidden">
    <header class="w-full h-[65px] px-8 bg-white border-b border-gray-200 flex items-center justify-between">
      <h1 class="text-2xl text-black-2 font-medium">
        Usuarios / Vendedores
      </h1>

      <div class="flex items-center gap-4">
        <button class="btn btn-sm bg-brand-orange text-white shadow-none hover:bg-brand-pink hover:border-brand-pink"
          @click="isOpenCreateSellerModal = true">
          <icon-plus class="w-4 h-4" />
          Nuevo usuario
        </button>
        <label class="input bg-white-1 border border-white-3 input-sm flex items-center gap-2">
          <input v-model="search" type="text" class="grow" placeholder="Buscar usuario...">
          <IconSearch class="w-4 h-4 text-black-2" />
        </label>
      </div>
    </header>

    <SellersTable ref="sellersTableRef" :search="search" @handlerEditSeller="openEditSellerModal" />

    <!-- CREATE SELLER MODAL -->
    <CreateSellerModal v-model="isOpenCreateSellerModal" @update:table="() => sellersTableRef.fetchAllSellers()" />

    <!-- EDIT SELLER MODAL -->
    <EditSellerModal v-model="isOpenEditSellerModal" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { IconSearch, IconPlus } from '@tabler/icons-vue'
import SellersTable from '../components/SellersTable.vue'
import CreateSellerModal from '../components/CreateSellerModal.vue'
import EditSellerModal from '../components/EditSellerModal.vue'

const search = ref('')
const isOpenCreateSellerModal = ref(false)
const isOpenEditSellerModal = ref(false)
const sellersTableRef = ref<any>(null)

const openEditSellerModal = () => {
  isOpenEditSellerModal.value = true
}
</script>

<style scoped>
.custom-shadow:hover {
  box-shadow: 0 4px 15px 0 #ff7270be;
}
</style>