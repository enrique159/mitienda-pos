<template>
  <div class="h-full w-full flex side-menu-grid">
    <side-menu :items-menu="productsMenu" />
    <router-view />
  </div>
</template>

<script setup lang="ts">
import SideMenu from '@/components/menus/SideMenu.vue'
import { IconBox, IconCategory } from '@tabler/icons-vue'
const productsMenu = [
  {
    title: 'Productos',
    path: '/main/products',
    icon: IconBox,
  },
  {
    title: 'Categorías',
    path: '/main/products/categories',
    icon: IconCategory,
  },
]
</script>

<style scoped></style>
