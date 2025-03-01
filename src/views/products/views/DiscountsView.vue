<template>
  <div class="overflow-hidden">
    <header class="w-full h-[65px] px-8 bg-white border-b border-gray-200 flex items-center justify-between">
      <h1 class="text-2xl text-black-2 font-medium">
        Descuentos
      </h1>
      <div class="flex items-center gap-4">
        <button
          class="btn btn-sm bg-brand-orange text-white shadow-none hover:bg-brand-pink hover:border-brand-pink"
          @click="show"
        >
          <icon-plus class="w-4 h-4" />
          Nuevo descuento
        </button>
        <label
          class="input bg-white-1 border border-white-3 input-sm flex items-center gap-2"
        >
          <input
            v-model="search"
            type="text"
            class="grow"
            placeholder="Buscar descuento..."
          >
          <IconSearch class="w-4 h-4 text-black-2" />
        </label>
      </div>
    </header>

    <DiscountsTable
      :search="search"
      @edit-discount="openEditDiscountModal"
      @attach-products-discounts="openAttachProductsDiscountsModal"
    />

    <CreateDiscountModal ref="createDiscountRef" />
    <EditDiscountModal ref="editDiscountRef" />
    <AttachProductsDiscounts ref="attachProductsDiscountsRef" />
  </div>
</template>

<script lang="ts" setup>
import CreateDiscountModal from '../components/CreateDiscountModal.vue'
import EditDiscountModal from '../components/EditDiscountModal.vue'
import AttachProductsDiscounts from '../components/AttachProductsDiscounts.vue'
import DiscountsTable from '../components/DiscountsTable.vue'
import { IconPlus, IconSearch } from '@tabler/icons-vue'
import { ref } from 'vue'
import { Discount } from '@/api/interfaces'

const search = ref('')

const createDiscountRef = ref()
const editDiscountRef = ref()
const attachProductsDiscountsRef = ref()

const show = () => {
  createDiscountRef.value.openCreateDiscountModal()
}

const openEditDiscountModal = (discount: Discount) => {
  editDiscountRef.value.openEditDiscountModal(discount)
}

const openAttachProductsDiscountsModal = (discount: Discount) => {
  attachProductsDiscountsRef.value.openAttachProductsDiscountsModal(discount)
}
</script>