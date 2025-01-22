<template>
  <div class="w-full flex justify-between items-center bg-white h-8 border-t border-gray-200 px-2">
    <span class="text-xs text-black-2">
      {{ isCashRegisterOpen ? `Caja abierta: ${formatDatetime(cashRegister?.opening_date)}` : 'Caja cerrada' }}
    </span>

    <div class="flex items-center gap-2">
      <span class="text-xs text-black-2">Cuenta: {{ configuration.mode }}</span>
      <span>|</span>
      <span class="text-xs text-black-2">{{ configuration.last_sync !== null ? `Última sincronizacion: ${formatDatetime}` : 'No sincronizado' }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCashRegister } from '@/composables/useCashRegister'
import { useConfiguration } from '@/composables/useConfiguration'
import { useDate } from '@/composables/useDate'

const { cashRegister, isCashRegisterOpen } = useCashRegister()
const { configuration } = useConfiguration()
const { formatDatetime } = useDate()
</script>