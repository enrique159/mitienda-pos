<template>
  <div class="flex flex-col h-full bg-white-1">
    <header
      class="bg-white w-full py-2 px-4 flex items-center border-b border-gray-200"
    >
      <img src="@/assets/logo_fill_orange.png" class="w-6 mr-6" />

      <div class="flex items-center gap-1 relative">
        <router-link
          v-for="option in menuOptions"
          :key="`menu-option-${option.label}`"
          :to="option.route"
          class="flex items-center justify-center gap-1 py-2 w-fit px-3 relative rounded-md cursor-pointer transition-all"
          :class="[
            currentRoute === option.value
              ? 'bg-brand-orange'
              : 'hover:bg-gray-100',
          ]"
        >
          <component
            :is="option.icon"
            :class="[
              currentRoute === option.value
                ? 'text-white'
                : 'text-brand-orange',
            ]"
            size="1.1rem"
            stroke-width="2"
          />
          <span
            class="text-sm font-medium"
            :class="[
              currentRoute === option.value ? 'text-white' : 'text-black-1',
            ]"
            >{{ option.label }}</span
          >
        </router-link>
      </div>

      <div class="ml-auto flex items-center gap-2">
        <AvatarContextMenu />
      </div>
    </header>

    <!-- MODULES VIEW -->
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import AvatarContextMenu from '@/components/AvatarContextMenu.vue'
import {
  IconShoppingBag,
  IconUsersGroup,
  IconSettings,
  IconPackage,
  IconCheckupList,
  IconReceipt,
  IconCashRegister,
  IconChartBar
} from '@tabler/icons-vue'
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import { useProduct } from '@/composables/useProduct'
import { getProducts } from '@/api/electron'
import { Product, Response } from '@/api/interfaces'
import { toast } from 'vue3-toastify'

const { setProducts } = useProduct()
const route = useRoute()

// El numero 2 es porque todas las rutas del main empiezan por /main/...
const currentRoute = computed(() => route.path.split('/')[2])

const menuOptions = [
  { id: 1, icon: IconShoppingBag, label: 'Vender', route: '/main/sales', value: 'sales', },
  { id: 2, icon: IconUsersGroup, label: 'Clientes', route: '/main/clients', value: 'clients', },
  { id: 3, icon: IconPackage, label: 'Artículos', route: '/main/products', value: 'products', },
  { id: 4, icon: IconCheckupList, label: 'Inventario', route: '/main/inventory', value: 'inventory', },
  { id: 5, icon: IconReceipt, label: 'Ventas', route: '/main/listsales', value: 'listsales', },
  { id: 6, icon: IconCashRegister, label: 'Caja', route: '/main/cashregister', value: 'cashregister', },
  { id: 7, icon: IconChartBar, label: 'Reportes', route: '/main/reports', value: 'reports', },
  { id: 8, icon: IconSettings, label: 'Ajustes', route: '/main/settings', value: 'settings', },
]

getProducts((response: Response<Product[]>) => {
  if (!response.success) {
    console.log(response.message)
    toast.error('Error al obtener los productos')
    return
  }
  setProducts(response.response)
})
</script>
