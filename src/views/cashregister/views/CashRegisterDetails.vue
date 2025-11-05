<template>
  <div class="p-8 pt-4 w-full overflow-y-auto max-w-[1080px] mx-auto space-y-4">
    <div class="flex items-center gap-2">
      <button class="btn btn-ghost btn-circle" @click="$router.push({ name: 'HistoryCashRegister' })">
        <IconArrowLeft />
      </button>
      <h6 class="text-2xl font-bold">
        Detalles de la caja
      </h6>
    </div>

    <div class="grid grid-cols-3 gap-4">
      <div class="col-span-1 flex flex-col">
        <p>Abierto por:</p>
        <p>Enrique marin</p>
      </div>
      <div class="col-span-1 flex flex-col">
        <p>Abierto por:</p>
        <p>Enrique marin</p>
      </div>
      <div class="col-span-1 flex flex-col">
        <p>Abierto por:</p>
        <p>Enrique marin</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconArrowLeft } from '@tabler/icons-vue';


</script>

<style lang="scss" scoped>

</style>