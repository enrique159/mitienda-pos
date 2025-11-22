<template>
  <div class="grid grid-cols-2 gap-4">
    <div
      v-for="seller in filteredSellers"
      :key="seller.id"
      class="bg-white border border-base-200 shadow-card p-4 rounded-3xl flex items-center gap-4"
    >
      <div class="avatar placeholder">
        <div class="bg-neutral text-neutral-content w-10 rounded-full">
          <span class="uppercase">{{ getFirst2Letters(seller.name) }}</span>
        </div>
      </div>
      <div>
        <h6 class="text-lg font-bold max-w-[150px] truncate">
          {{ seller.name }}
        </h6>
        <div class="flex">
          <div
            class="badge badge-outline"
            :class="{
              'badge-error': seller.status === SellerStatus.INACTIVE,
              'badge-success': seller.status === SellerStatus.ACTIVE,
            }"
          >
            {{ seller.status === SellerStatus.ACTIVE ? 'activo' : 'inactivo' }}
          </div>
          <!-- <p
            class="text-sm"
            :class="{
              'text-gray-300': userType(seller.permissions).level === 0,
              'text-green-600': userType(seller.permissions).level === 1,
              'text-brand-blue': userType(seller.permissions).level === 2,
              'text-brand-orange': userType(seller.permissions).level === 3,
            }"
          >
            {{ userType(seller.permissions).label }}
          </p> -->
        </div>
      </div>
      <div class="ml-auto flex items-center gap-2">
        <div class="tooltip tooltip-top" data-tip="Permisos">
          <action-button @on:click="openPermissionsModal(seller)">
            <IconShieldHalfFilled size="16" class="text-brand-blue" />
          </action-button>
        </div>
        <div class="tooltip tooltip-top" data-tip="Editar vendedor">
          <action-button @on:click="handlerEditSeller(seller)">
            <IconEdit size="18" />
          </action-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { IconEdit, IconShieldHalfFilled } from '@tabler/icons-vue'
import { getAllSellers } from '@/api/electron'
import { Seller, Response, SellerStatus } from '@/api/interfaces'
import { toast } from '@/composables/useToast'
import { userType } from '@/api/interfaces/permissions'

const props = defineProps<{
  search: string
}>()

const emit = defineEmits<{
  (e: 'edit:seller', user: Seller): void
  (e: 'edit:seller:permissions', user: Seller): void
}>()

const sellers = ref<Array<Seller>>([])

const filteredSellers = computed(() => {
  return sellers.value.filter((seller) =>
    seller.name.toLowerCase().includes(props.search.toLowerCase())
  )
})

const getFirst2Letters = (name: string) => name.slice(0, 2)

const fetchSellers = () => {
  getAllSellers((response: Response<Seller[]>) => {
    if (!response.success) {
      toast.error(response.message)
      return
    }
    sellers.value = response.response
  })
}
fetchSellers()

const handlerEditSeller = (user: Seller) => {
  emit('edit:seller', user)
}

const openPermissionsModal = (user: Seller) => {
  emit('edit:seller:permissions', user)
}

defineExpose({
  fetchSellers,
})
</script>
