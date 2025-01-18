<template>
  <section class="w-full grid grid-cols-12 bg-white pb-1 pt-3 px-3 border-t border-gray-200">
    <div class="col-span-8 flex justify-between items-start pl-4 pr-8">
      <div class="flex items-center gap-2">
        <base-button class="flex items-center gap-1">
          Agregar cliente
          <IconUserPlus class="text-brand-black" size="18" />
        </base-button>

        <base-button>
          Cuenta pendiente
        </base-button>
      </div>

      <button class="btn bg-brand-black hover:bg-brand-blue text-brand-white text-lg flex items-center gap-2">
        Pagar cuenta
        <icon-receipt-2 size="24" />
      </button>
    </div>

    <div class="col-span-4">
      <div class="h-fit py-1 bg-white-1 rounded-2xl">
        <div class="flex justify-between items-center px-4 py-1">
          <p class="font-bold text-black-1">
            Total
          </p>
          <p class="font-bold">
            {{ formatCurrency(currentCartTotal) }}
          </p>
        </div>

        <div class="flex justify-between items-center px-4 py-1 border-b border-gray-200">
          <p class="font-bold text-black-1">
            Descuento
          </p>
          <p class="font-bold">
            0.00
          </p>
        </div>

        <div class="flex justify-between items-center px-4 py-3">
          <p class="font-black text-xl">
            Total a pagar
          </p>
          <p class="font-black text-xl text-green-600">
            {{ formatCurrency(currentCartTotal) }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useProduct } from '@/composables/useProduct'
import { useCurrency } from '@/composables/useCurrency'
import { IconUserPlus, IconReceipt2 } from '@tabler/icons-vue'
const { formatCurrency } = useCurrency()

const { currentCartTotal } = useProduct()
</script>

<style scoped>

</style>