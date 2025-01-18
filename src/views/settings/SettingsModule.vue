<template>
  <div class="h-full w-full flex settings-grid">
    <section class="h-full bg-white border-r border-white-3 p-2">
      <ul class="list-none">
        <li
          v-for="item in settingsMenu"
          :key="`nav-option-menu-settings-${item.title}`"
          class="mb-2"
        >
          <router-link
            :to="item.path"
            class="hover:bg-white-2 rounded-lg pl-4 pr-2 py-2 flex items-center gap-2 transition-all active:scale-95 active:bg-white-3 text-[0.9rem] relative"
            :class="[
              currentSettingsPath === item.path
                ? 'text-brand-orange show-badge'
                : 'text-black-1',
            ]"
          >
            <component :is="item.icon" size="18" stroke-width="2" />
            {{ item.title }}
          </router-link>
        </li>
      </ul>
    </section>
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import {
  IconSettings2,
  IconBuildingStore,
  IconUsers,
  IconReportMoney,
  IconPrinter,
  IconCashRegister,
  IconLaurelWreath,
  IconHelp,
  IconInfoCircle
} from '@tabler/icons-vue'

const route = useRoute()

const currentSettingsPath = computed(() => route.path)

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

.show-badge::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 4px;
  width: 5px;
  border-radius: 5px;
  height: 24px;
  transform: translateY(-12px);
  background-color: #f2994a;
}
</style>
