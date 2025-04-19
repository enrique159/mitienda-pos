<template>
  <div class="w-full h-full cash-register-grid">
    <side-menu :items-menu="cashRegisterMenu" />
    <router-view />
  </div>
</template>

<script setup lang="ts">
import SideMenu from '@/components/menus/SideMenu.vue'
import { IconCashRegister, IconSwipeRight, IconDeviceDesktopDollar } from '@tabler/icons-vue'
const cashRegisterMenu = [
  {
    title: 'Estado actual',
    path: '/main/cashregister/current-state',
    icon: IconCashRegister,
  },
  {
    title: 'Ingresar o retirar',
    path: '/main/cashregister/movements',
    icon: IconSwipeRight,
  },
  {
    title: 'Cierre de caja',
    path: '/main/cashregister/close',
    icon: IconDeviceDesktopDollar,
  },
]

</script>

<style scoped>
.cash-register-grid {
  display: grid;
  grid-template-columns: 240px 1fr;
}
</style>