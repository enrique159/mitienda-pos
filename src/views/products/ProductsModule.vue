<template>
  <div class="w-full flex side-menu-grid">
    <side-menu :items-menu="productsMenu" />
    <router-view />
  </div>
</template>

<script setup lang="ts">
import SideMenu from '@/components/menus/SideMenu.vue'
import { IconBox, IconCategory, IconCirclePlus, IconCoins } from '@tabler/icons-vue'
import { getTaxes } from '@/api/electron'
import { useTax } from '@/composables/useTax'
import { onMounted } from 'vue'
import { toast } from 'vue3-toastify'

const { taxes } = useTax()

const loadTaxes = async () => {
  const response = await getTaxes()
  if (!response.success) {
    toast.error(response.message)
    return
  }
  taxes.value = response.response
}

onMounted(() => {
  loadTaxes()
})

const productsMenu = [
  {
    title: 'Productos',
    path: '/main/products',
    icon: IconBox,
  },
  {
    title: 'Nuevo producto',
    path: '/main/products/create',
    icon: IconCirclePlus,
  },
  {
    title: 'Categorías',
    path: '/main/products/categories',
    icon: IconCategory,
  },
  {
    title: 'Impuestos',
    path: '/main/products/taxes',
    icon: IconCoins,
  },
]
</script>

<style scoped></style>
