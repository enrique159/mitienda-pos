<template>
  <div class="w-full h-full inventory-grid">
    <side-menu :items-menu="inventoryMenu" />
    <router-view />
  </div>
</template>

<script setup lang="ts">
import SideMenu, { ItemMenu } from '@/components/menus/SideMenu.vue'
import { IconCirclePlus, IconListCheck } from '@tabler/icons-vue'
import { getAllProducts } from '@/api/electron'
import { Product, Response } from '@/api/interfaces'
import { useProduct } from '@/composables/useProduct'
import { toast } from '@/composables/useToast'
import { onMounted } from 'vue'
import { useInventory } from '@/composables/useInventory'

const { setAllProducts } = useProduct()
const { refreshInventories } = useInventory()

onMounted(() => {
  refreshInventories().then((response) => {
    if (!response.success) {
      toast.error(response.message)
    }
  })

  getAllProducts((response: Response<Product[]>) => {
    if (!response.success) {
      toast.error(response.message)
      return
    }
    setAllProducts(response.response)
  })
})

const inventoryMenu: ItemMenu[] = [
  {
    title: 'Inventarios',
    path: '/main/inventory',
    icon: IconListCheck,
    subPaths: [
      '/main/inventory/details',
    ],
  },
  {
    title: 'Nuevo inventario',
    path: '/main/inventory/create',
    icon: IconCirclePlus,
  },
]
</script>

<style scoped>
.inventory-grid {
  display: grid;
  grid-template-columns: 240px 1fr;
}
</style>
