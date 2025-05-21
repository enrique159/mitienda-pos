<template>
  <div class="h-full w-full flex settings-grid">
    <side-menu :items-menu="settingsMenu" />
    <router-view />
  </div>
</template>

<script setup lang="ts">
import SideMenu from '@/components/menus/SideMenu.vue'
import {
  IconSettings2,
  IconBuildingStore,
  IconUsers,
  IconReportMoney,
  IconPrinter,
  IconCashRegister,
  IconLaurelWreath,
  IconHelp,
  IconInfoCircle,
  IconSparkles
} from '@tabler/icons-vue'

const settingsMenu = [
  {
    title: 'Ajustes generales',
    path: '/main/settings/general',
    icon: IconSettings2,
  },
  {
    title: 'Informacion del negocio',
    path: '/main/settings/business',
    icon: IconBuildingStore,
  },
  {
    title: 'Usuarios y permisos',
    path: '/main/settings/users',
    icon: IconUsers,
  },
  {
    title: 'Ventas y productos',
    path: '/main/settings/sales-and-products',
    icon: IconReportMoney,
  },
  {
    title: 'Impresora y tickets',
    path: '/main/settings/printer',
    icon: IconPrinter,
  },
  {
    title: 'Caja y facturación',
    path: '/main/settings/cashier',
    icon: IconCashRegister,
  },
  {
    title: 'Cuenta y suscripciones',
    path: '/main/settings/account',
    icon: IconLaurelWreath,
  },
  {
    title: 'Modelos AI',
    path: '/main/settings/ai',
    icon: IconSparkles,
  },
  {
    title: 'Ayuda y soporte',
    path: '/main/settings/help',
    icon: IconHelp,
  },
  {
    title: 'Acerca de',
    path: '/main/settings/about',
    icon: IconInfoCircle,
  },
]
</script>

<style lang="scss" scoped>
.settings-grid {
  display: grid;
  grid-template-columns: 240px auto;
}
</style>
