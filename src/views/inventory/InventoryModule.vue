<template>
  <div class="w-full h-full inventory-grid">
    <side-menu :items-menu="inventoryMenu" />
    <router-view />
  </div>
</template>

<script setup lang="ts">
import SideMenu from '@/components/menus/SideMenu.vue'
import { IconListCheck } from '@tabler/icons-vue'

const inventoryMenu = [
  {
    title: 'Inventarios',
    path: '/main/inventory',
    icon: IconListCheck,
  },
]
</script>

<style scoped>
.inventory-grid {
  display: grid;
  grid-template-columns: 240px 1fr;
}
</style>