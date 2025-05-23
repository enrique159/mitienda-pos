<template>
  <div class="w-full flex justify-between items-center bg-white h-8 border-t border-gray-200 px-2">
    <span class="text-xs text-black-2">
      {{ isCashRegisterOpen ? `Caja abierta: ${formatDatetime(cashRegister?.opening_date)}` : 'Caja cerrada' }}
    </span>

    <div class="flex items-center gap-2">
      <span v-if="isInitialized" class="text-xs text-black-2 flex items-center gap-1 capitalize">
        <IconSparkles size="12" class="text-brand-blue" />
        {{ currentModel }}</span>
      <span v-else class="text-xs text-black-2">Modelo: No inicializado</span>
      <span>|</span>
      <span class="text-xs text-black-2">Cuenta: {{ configuration.mode }}</span>
      <span>|</span>
      <span class="text-xs text-black-2">{{ configuration.last_sync !== null ? `Última sincronizacion: ${formatDatetime}` : 'No sincronizado' }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconSparkles } from '@tabler/icons-vue'
import { useCashRegister } from '@/composables/useCashRegister'
import { useConfiguration } from '@/composables/useConfiguration'
import { useAI } from '@/composables/useAI'
import { useDate } from '@/composables/useDate'

const { cashRegister, isCashRegisterOpen } = useCashRegister()
const { configuration } = useConfiguration()
const { formatDatetime } = useDate()
const { isInitialized, currentModel } = useAI()
</script>