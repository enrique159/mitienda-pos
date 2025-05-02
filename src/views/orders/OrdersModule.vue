<template>
  <div class="w-full h-full orders-grid">
    <side-menu :items-menu="ordersMenu" />
    <router-view />
  </div>
</template>

<script setup lang="ts">
import SideMenu from '@/components/menus/SideMenu.vue'
import { IconTruckDelivery } from '@tabler/icons-vue'

const ordersMenu = [
  {
    title: 'Pedidos',
    path: '/main/orders',
    icon: IconTruckDelivery,
  },
]
</script>

<style scoped>
.orders-grid {
  display: grid;
  grid-template-columns: 240px 1fr;
}
</style>