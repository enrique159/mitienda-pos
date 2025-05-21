<template>
  <div class="flex flex-col h-full bg-white-1 overflow-hidden">
    <header
      class="bg-white w-full py-2 px-4 flex items-center border-b border-gray-200"
    >
      <img src="@/assets/logo_orange.svg" class="w-6 mr-6">

      <div class="flex items-center gap-1 relative">
        <router-link
          v-for="option in menuOptions"
          :key="`menu-option-${option.label}`"
          :to="option.route"
          class="flex items-center justify-center gap-1 py-2 w-fit px-2 relative rounded-md cursor-pointer transition-all"
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
          >{{ option.label }}</span>
        </router-link>
      </div>

      <div class="ml-auto flex items-center gap-2">
        <div class="flex flex-col justify-center items-end">
          <span class="text-sm font-bold">{{ branch.branch_alias }}</span>
          <span class="text-xs">{{ showHour }}</span>
        </div>
        <AvatarContextMenu />
      </div>
    </header>

    <!-- MODULES VIEW -->
    <slot />

    <MainStatusBar />
  </div>
</template>

<script setup lang="ts">
import AvatarContextMenu from '@/components/AvatarContextMenu.vue'
import MainStatusBar from '@/components/MainStatusBar.vue'
import {
  IconShoppingBag,
  IconUsersGroup,
  IconSettings,
  IconPackage,
  IconCheckupList,
  IconReceipt,
  IconCashRegister,
  IconChartBar,
  IconTruckDelivery
} from '@tabler/icons-vue'
import { ref, computed, watchEffect, onBeforeUnmount, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProduct } from '@/composables/useProduct'
import { useBranch } from '@/composables/useBranch'
import { useCashRegister } from '@/composables/useCashRegister'
import { getProducts, getCategories, getBranchInfo, getCashRegisterActive, getCustomers, getCompany, getAiModels } from '@/api/electron'
import { Category, Product, Response, Branch, Company, AiModel } from '@/api/interfaces'
import { useConfiguration } from '@/composables/useConfiguration'
import { useDate } from '@/composables/useDate'
import { useCustomer } from '@/composables/useCustomer'
import { useCompany } from '@/composables/useCompany'
import { useUser } from '@/composables/useUser'
import { useAI } from '@/composables/useAI'
import { toast } from 'vue3-toastify'

const { setProducts, setCategories } = useProduct()
const { setBranch, branch } = useBranch()
const { setCashRegister } = useCashRegister()
const { getCurrentDate } = useDate()
const { setCustomers } = useCustomer()
const { setCompany } = useCompany()
const { setAiModels, defaultAiModel, aiModels } = useConfiguration()
const { logout } = useUser()
const { isInitialized, initializeModel, reset: resetAI } = useAI()
const route = useRoute()
const router = useRouter()

// El numero 2 es porque todas las rutas del main empiezan por /main/...
const currentRoute = computed(() => route.path.split('/')[2])

const menuOptions = [
  { id: 1, icon: IconShoppingBag, label: 'Vender', route: '/main/sales', value: 'sales' },
  { id: 2, icon: IconUsersGroup, label: 'Clientes', route: '/main/clients', value: 'clients' },
  { id: 3, icon: IconPackage, label: 'Artículos', route: '/main/products', value: 'products' },
  { id: 4, icon: IconTruckDelivery, label: 'Pedidos', route: '/main/orders', value: 'orders' },
  { id: 5, icon: IconCheckupList, label: 'Inventario', route: '/main/inventory', value: 'inventory' },
  { id: 6, icon: IconReceipt, label: 'Ventas', route: '/main/listsales', value: 'listsales' },
  { id: 7, icon: IconCashRegister, label: 'Caja', route: '/main/cashregister', value: 'cashregister' },
  { id: 8, icon: IconChartBar, label: 'Reportes', route: '/main/reports', value: 'reports' },
  { id: 9, icon: IconSettings, label: 'Ajustes', route: '/main/settings', value: 'settings' },
]

const getAllData = async() => {
  // Get company info
  getCompany((response: Response<Company>) => {
    if (!response.success) {
      toast.error('Error al obtener la información de la empresa')
      return
    }
    setCompany(response.response)
    if (response.response.ai_enabled) {
      getAllAiModels()
    }
  })

  // Get products
  getProducts((response: Response<Product[]>) => {
    if (!response.success) {
      toast.error('Error al obtener los productos')
      return
    }
    setProducts(response.response)
  })

  // Get categories
  getCategories((response: Response<Category[]>) => {
    if (!response.success) {
      toast.error('Error al obtener las categorías de los productos')
      return
    }
    // Add Todos category
    setCategories(response.response)
  })

  // Get branch info
  getBranchInfo((response: Response<Branch>) => {
    if (!response.success) {
      toast.error('Error al obtener la información de la sucursal')
      return
    }
    setBranch(response.response)
  })

  // Get customers
  const customersResponse = await getCustomers()
  if (!customersResponse.success) {
    toast.error('Error al obtener los clientes')
    return
  }
  setCustomers(customersResponse.response)

  // Get cash register opened
  const cashRegisterActive = await getCashRegisterActive()
  if (!cashRegisterActive.success) {
    toast.error('Error al obtener la información de la caja')
    return
  }
  if (!cashRegisterActive.response) {
    router.push('/main/open-cash-register')
  }
  setCashRegister(cashRegisterActive.response)
}

getAllData()

// Get ai models
const getAllAiModels = () => {
  getAiModels((response: Response<AiModel[]>) => {
    if (!response.success) {
      toast.error('Error al obtener los modelos de IA')
      return
    }
    setAiModels(response.response)
    if (aiModels.value.length > 0) {
      if (defaultAiModel.value) {
        initializeModel(defaultAiModel.value.name, {
          modelName: defaultAiModel.value.model,
          apiKey: defaultAiModel.value.api_key,
        })
      }
    }
  })
}

// Get real time hour
const time = ref(getCurrentDate())

watchEffect(() => {
  const interval = setInterval(() => {
    time.value = getCurrentDate()
  }, 1000)

  onBeforeUnmount(() => {
    clearInterval(interval)
  })
})

const showHour = computed(() => time.value)

// System events
const cleanupFunctions: (() => void)[] = []

// System suspend handler
const suspendHandler = () => {
  logout()
  router.push({ name: 'SignInAsUser' })
}

// System resume handler
const resumeHandler = () => {
  console.log('System Resume')
}

// Register event listeners
cleanupFunctions.push(
  window.electron.onSystemSuspend(suspendHandler),
  window.electron.onSystemResume(resumeHandler)
)

// Cleanup on component unmount
onUnmounted(() => {
  cleanupFunctions.forEach((cleanup) => cleanup?.())
  if (isInitialized.value) {
    resetAI()
  }
})
</script>
