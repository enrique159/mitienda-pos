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
        <div class="flex flex-col justify-center items-end">
          <span class="text-sm font-bold">{{ branch.branch_alias }}</span>
          <span class="text-xs">{{ getCurrentDate() }}</span>
        </div>
        <AvatarContextMenu />
      </div>
    </header>

    <!-- MODULES VIEW -->
    <slot></slot>

    <div class="w-full bg-white h-8 border-t border-gray-200">


    </div>
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
import { useBranch } from '@/composables/useBranch'
import { useCashRegister } from '@/composables/useCashRegister'
import { getProducts, getProductCategories, getBranchInfo, getCashRegisterActive } from '@/api/electron'
import { Category, Product, Response, Branch } from '@/api/interfaces'
import { useDate } from '@/composables/useDate'
import { toast } from 'vue3-toastify'
import router from '@/router'

const { setProducts, setCategories } = useProduct()
const { setBranch, branch } = useBranch()
const { setCashRegister } = useCashRegister()
const route = useRoute()
const { getCurrentDate } = useDate()

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

getProductCategories((response: Response<Category[]>) => {
  if (!response.success) {
    console.log(response.message)
    toast.error('Error al obtener las categorías de los productos')
    return
  }
  // Add Todos category
  response.response.unshift({ category: 'Todos' })
  setCategories(response.response)
})

getBranchInfo((response: Response<Branch>) => {
  if (!response.success) {
    console.log(response.message)
    toast.error('Error al obtener la información de la sucursal')
    return
  }
  setBranch(response.response)
})

const getCashRegisterOpened = async () => {
  const response = await getCashRegisterActive()
  if (!response.success) {
    toast.error('Error al obtener la información de la caja')
    return
  }
  if (!response.response) {
    router.push('/main/open-cash-register')
  }
  setCashRegister(response.response)
}

getCashRegisterOpened()
</script>
