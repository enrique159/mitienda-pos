<template>
  <div
    class="p-8 pt-4 w-full max-w-[1080px] mx-auto space-y-4 overflow-y-auto pb-[6rem]"
  >
    <h6 class="text-2xl font-bold">Usuarios / Vendedores</h6>

    <section class="bg-white p-4 rounded-xl space-y-4">
      <div class="flex justify-between items-center">
        <h6 class="text-lg font-bold">Lista de vendedores</h6>

        <div class="flex items-center gap-2">
          <label
            class="input bg-white-1 border border-white-3 input-sm flex items-center gap-2"
          >
            <input
              v-model="search"
              type="text"
              class="grow"
              placeholder="Buscar vendedor..."
            />
            <IconSearch class="w-4 h-4 text-black-2" />
          </label>
          <button
            class="btn btn-sm bg-brand-orange text-white shadow-none hover:bg-brand-pink hover:border-brand-pink"
            @click="openCreateSellerModal"
          >
            <icon-plus class="w-4 h-4" />
            Nuevo vendedor
          </button>
        </div>
      </div>

      <SellersTable
        ref="sellersTableRef"
        :search="search"
        @edit:seller="openEditSellerModal"
        @edit:seller:permissions="openPermissionsModal"
      />
    </section>

    <!-- PERMISSIONS MODAL -->
    <PermissionsModal
      v-model="isOpenPermissionsModal"
      :permissions="currentUser?.permissions"
      :id-user="currentUser?.id"
    />

    <!-- CREATE SELLER MODAL -->
    <CreateSellerModal
      v-model="isOpenCreateSellerModal"
      @update:table="() => sellersTableRef.fetchSellers()"
    />

    <!-- EDIT SELLER MODAL -->
    <EditSellerModal
      v-model="isOpenEditSellerModal"
      :seller="currentUser"
      @update:table="() => sellersTableRef.fetchSellers()"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { IconSearch, IconPlus } from '@tabler/icons-vue'
import SellersTable from '../components/SellersTable.vue'
import CreateSellerModal from '../components/CreateSellerModal.vue'
import PermissionsModal from '../components/PermissionsModal.vue'
import EditSellerModal from '../components/EditSellerModal.vue'
import { Seller } from '@/api/interfaces'

const search = ref('')
const currentUser = ref<Seller | null>(null)

const isOpenCreateSellerModal = ref(false)
const isOpenEditSellerModal = ref(false)
const isOpenPermissionsModal = ref(false)

const sellersTableRef = ref<any>(null)

const openEditSellerModal = (user: Seller) => {
  currentUser.value = user
  isOpenEditSellerModal.value = true
}

const openCreateSellerModal = () => {
  isOpenCreateSellerModal.value = true
}

const openPermissionsModal = (user: Seller) => {
  currentUser.value = user
  isOpenPermissionsModal.value = true
}
</script>
