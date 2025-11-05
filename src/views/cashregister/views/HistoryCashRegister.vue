<template>
  <div class="overflow-hidden">
    <header
      class="w-full h-[65px] px-8 bg-white border-b border-gray-200 flex items-center justify-between"
    >
      <h1 class="text-2xl text-black-2 font-medium">Historial de cajas</h1>
      <div class="flex items-center gap-4">
        <div class="dropdown dropdown-end">
          <base-button
            tabindex="0"
            role="button"
            class="flex h-8 items-center gap-2"
          >
            <IconCalendar class="w-4 h-4" />
            Filtrar por fecha
          </base-button>
          <div
            tabindex="0"
            class="dropdown-content menu bg-base-100 rounded-box z-[1] w-fit p-2 shadow border border-gray-200 mt-2"
          >
            <date-picker
              v-model="filterDate"
              range
              inline
              auto-apply
              :enable-time-picker="false"
              :timezone="timezone"
              locale="es-MX"
            />
          </div>
        </div>
        <label
          class="input bg-white-1 border border-white-3 input-sm flex items-center gap-2"
        >
          <input
            v-model="search"
            type="text"
            class="grow"
            placeholder="Buscar caja..."
          />
          <IconSearch class="w-4 h-4 text-black-2" />
        </label>
      </div>
    </header>

    <HistoryCashRegisterTable :search="search" />
  </div>
</template>

<script lang="ts" setup>
import { IconCalendar, IconSearch } from '@tabler/icons-vue'
import HistoryCashRegisterTable from '../components/HistoryCashRegisterTable.vue'
import { useBranch } from '@/composables/useBranch'
import { ref } from 'vue'

const { timezone } = useBranch()

const search = ref('')
const filterDate = ref({
  start: new Date(),
  end: new Date(),
})
</script>
