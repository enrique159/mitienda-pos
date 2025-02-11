<template>
  <div class="w-full flex side-menu-grid">
    <side-menu :items-menu="listSalesMenu" />
    <router-view />
  </div>
</template>

<script setup lang="ts">
import SideMenu from '@/components/menus/SideMenu.vue'
import { IconReportMoney } from '@tabler/icons-vue'
import { ref } from 'vue'

const listSalesMenu = ref([
  {
    title: 'Ventas',
    path: '/main/listsales',
    icon: IconReportMoney,
  },
])
</script>

<style scoped>

</style>