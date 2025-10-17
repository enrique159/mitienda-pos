<template>
  <div class="w-full h-full reports-grid">
    <side-menu :items-menu="reportsMenu" />
    <router-view />
  </div>
</template>

<script setup lang="ts">
import SideMenu from '@/components/menus/SideMenu.vue'
import { IconListCheck } from '@tabler/icons-vue'

const reportsMenu = [
  {
    title: 'Reportes',
    path: '/main/reports',
    icon: IconListCheck,
  },
]
</script>

<style scoped>
.reports-grid {
  display: grid;
  grid-template-columns: 240px 1fr;
}
</style>