<template>
  <div class="w-full h-full bg-brand-orange flex flex-col pt-12 pb-6 px-6 justify-between items-center">
    <div class="flex items-center gap-2">
      <img src="@/assets/logo_white.svg" alt="Logo" class="w-24" />
      <div>
        <h1 class="text-white font-medium text-[3rem] leading-10">Mi Tienda</h1>
        <p class="text-white-1 text-lg font-medium pl-1">El punto de venta ideal para ti</p>
      </div>
    </div>

    <div class="flex flex-col items-center justify-center gap-4">
      <h2 class="text-white mb-4 text-xl font-medium">Bienvenido</h2>
      <button class="btn w-[280px] bg-brand-black hover:bg-brand-black border-none text-white">
        Ya tengo una cuenta
      </button>

      <button class="btn w-[280px] bg-brand-white hover:bg-brand-pink hover:text-white border-none text-brand-pink">
        Configurar mi cuenta desde cero
      </button>

      <p class="text-center text-white-1 text-sm font-bold mt-4">
        Si tienes dudas, puedes consultar nuestra sección <br> de <a class="text-brand-black underline" href="#">documentación</a> en nuestro sitio web.
      </p>
    </div>

    <div class="w-full flex justify-between text-white-1">
      <a href="#" class="hover:underline">mitiendapos.net</a>
      <a href="#" class="flex items-center gap-2 hover:underline">
        <icon-lifebuoy class="w-6 h-6" />
        ¿Necesitas ayuda?
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconLifebuoy } from '@tabler/icons-vue'
import { useTitle } from '@vueuse/core';

useTitle('Bienvenido a Mi Tienda');
</script>

<style scoped>

</style>