<template>
  <div class="w-full h-full reports-grid bg-white-1 overflow-hidden">
    <side-menu :items-menu="reportsMenu" />
    <section class="h-full overflow-auto pb-20">
      <header class="h-[65px] px-8 bg-white border-b border-gray-200 flex items-center justify-between sticky top-0 z-10">
        <div>
          <h1 class="text-2xl text-black-1 font-semibold">
            Reportes
          </h1>
          <p class="text-sm text-black-3">
            Consulta ventas, caja, inventario y compras
          </p>
        </div>
        <div v-if="loading" class="badge bg-brand-white text-brand-orange border-none h-9 px-4">
          Actualizando...
        </div>
      </header>

      <div class="p-6 space-y-5 max-w-[1440px] mx-auto">
        <ReportFilters
          v-model="filters"
          :catalogs="reportData.catalogs"
          :loading="loading"
          @apply="loadReports"
          @reset="resetFilters"
        />
        <router-view />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import SideMenu from '@/components/menus/SideMenu.vue'
import {
  IconBuildingWarehouse,
  IconCashRegister,
  IconCreditCard,
  IconDownload,
  IconListCheck,
  IconPackage,
  IconReceipt,
  IconShoppingCart,
} from '@tabler/icons-vue'
import { onMounted } from 'vue'
import ReportFilters from './components/ReportFilters.vue'
import { useReports } from '@/composables/useReports'

const { reportData, filters, loading, loadReports, resetFilters } = useReports()

const reportsMenu = [
  {
    title: 'Resumen general',
    path: '/main/reports',
    icon: IconListCheck,
  },
  {
    title: 'Reporte de ventas',
    path: '/main/reports/sales',
    icon: IconReceipt,
  },
  {
    title: 'Reporte por productos',
    path: '/main/reports/products',
    icon: IconPackage,
  },
  {
    title: 'Reporte de caja',
    path: '/main/reports/cash',
    icon: IconCashRegister,
  },
  {
    title: 'Creditos / pendientes',
    path: '/main/reports/credits',
    icon: IconCreditCard,
  },
  {
    title: 'Inventario',
    path: '/main/reports/inventory',
    icon: IconBuildingWarehouse,
  },
  {
    title: 'Compras / proveedores',
    path: '/main/reports/purchases',
    icon: IconShoppingCart,
  },
  {
    title: 'Exportaciones',
    path: '/main/reports/exports',
    icon: IconDownload,
  },
]

onMounted(() => {
  loadReports()
})
</script>

<style scoped>
.reports-grid {
  display: grid;
  grid-template-columns: 240px 1fr;
}
</style>
