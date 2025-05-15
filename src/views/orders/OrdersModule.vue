<template>
  <div class="w-full h-full orders-grid">
    <side-menu :items-menu="ordersMenu" />
    <router-view />
  </div>
</template>

<script setup lang="ts">
import SideMenu from '@/components/menus/SideMenu.vue'
import { IconTruckDelivery, IconCirclePlus } from '@tabler/icons-vue'
import { getPurchaseOrders, getProviders, getAllProducts } from '@/api/electron'
import { onMounted } from 'vue'
import { usePurchaseOrder } from '@/composables/usePurchaseOrder'
import { Provider, Response, Product } from '@/api/interfaces'
import { toast } from 'vue3-toastify'
import { PurchaseOrder } from '@/api/interfaces'
import { useProvider } from '@/composables/useProvider'
import { useProduct } from '@/composables/useProduct'

const { setPurchaseOrders } = usePurchaseOrder()
const { setProviders } = useProvider()
const { setAllProducts } = useProduct()

onMounted(async () => {
  getPurchaseOrders((response: Response<PurchaseOrder[]>) => {
    if (!response.success) {
      toast.error(response.message)
      return
    }
    setPurchaseOrders(response.response)
  })

  getProviders((response: Response<Provider[]>) => {
    if (!response.success) {
      toast.error(response.message)
      return
    }
    setProviders(response.response)
  })

  getAllProducts((response: Response<Product[]>) => {
    if (!response.success) {
      toast.error(response.message)
      return
    }
    setAllProducts(response.response)
  })
})

const ordersMenu = [
  {
    title: 'Pedidos',
    path: '/main/orders',
    icon: IconTruckDelivery,
  },
  {
    title: 'Nuevo pedido',
    path: '/main/orders/create',
    icon: IconCirclePlus,
  },
]
</script>

<style scoped>
.orders-grid {
  display: grid;
  grid-template-columns: 240px 1fr;
}
</style>