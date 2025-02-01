<template>
  <div class="w-full h-full side-menu-grid">
    <side-menu :items-menu="clientsMenu" />
    <router-view />
  </div>
</template>

<script setup lang="ts">
import SideMenu from '@/components/menus/SideMenu.vue'
import { IconUserPlus, IconUsers } from '@tabler/icons-vue'
const clientsMenu = [
  {
    title: 'Clientes',
    path: '/main/clients',
    icon: IconUsers,
  },
  {
    title: 'Nuevo cliente',
    path: '/main/clients/create',
    icon: IconUserPlus,
  },
]

</script>