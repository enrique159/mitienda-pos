<template>
  <div class="grid-sales h-full">
    <section class="w-full pb-1 pt-2 px-4 bg-white">
      <p class="text-2xl font-semibold text-gray-800">Ticket No. 2300001</p>
    </section>
    <!-- SEARCH CODEBAR -->
    <section class="w-full flex items-center justify-between bg-white h-fit py-2 px-2 border-b border-gray-200">
      <div class="flex items-center gap-2">
        <input type="text" class="w-[260px] h-10 px-4 border border-gray-300 rounded-md" placeholder="Buscar por código o nombre" />
        <button class="bg-white-3 hover:bg-white-2 px-4 h-10 rounded-md active:scale-95 transition-all text-sm">
          Agregar artículo
        </button>
        <button class="bg-white-3 hover:bg-white-2 h-10 px-4 rounded-md active:scale-95 transition-all text-sm flex items-center gap-2">
          Buscar artículo <div class="w-4 h-4 rounded border border-gray-400 flex justify-center items-center text-[0.5rem]">F2</div>
        </button>
      </div>

      <div class="flex justify-center items-center gap-2">
        <button class="bg-white-3 hover:bg-white-2 h-10 px-4 rounded-md active:scale-95 transition-all text-sm flex items-center gap-2">
          Artículos comunes <div class="w-4 h-4 rounded border border-gray-400 flex justify-center items-center text-[0.5rem]">F2</div>
        </button>
      </div>

      <div class="flex justify-center items-center gap-2">
        <button class="bg-white-3 hover:bg-white-2 h-10 px-4 rounded-md active:scale-95 transition-all text-sm flex items-center gap-2">
          Artículos comunes <div class="w-4 h-4 rounded border border-gray-400 flex justify-center items-center text-[0.5rem]">F2</div>
        </button>
      </div>
    </section>
    <!-- CURRENT SALE TABLE -->
    <CurrentSaleTable />

    <!-- PAYMENT SECTION -->
    <CurrentSalePayment />
  </div>
</template>

<script setup lang="ts">
import CurrentSaleTable from './components/CurrentSaleTable.vue';
import CurrentSalePayment from './components/CurrentSalePayment.vue';
</script>

<style lang="scss" scoped>
.grid-sales {
  display: grid;
  grid-template-rows: 50px 57px 1fr 200px;  
}
</style>