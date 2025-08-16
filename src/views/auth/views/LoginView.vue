<template>
  <div
    class="w-full h-full bg-brand-orange flex flex-col pt-12 pb-6 px-6 justify-between items-center"
  >
    <div class="flex items-center gap-2">
      <img src="@/assets/logo_full_white.svg" alt="Logo" class="w-[198px]">
    </div>

    <div class="flex flex-col items-center justify-center gap-4">
      <h2 class="text-white mb-4 text-3xl font-medium">
        Bienvenido
      </h2>
      <router-link
        :to="{ name: 'InitialConfig' }"
        role="button"
        class="btn w-[280px] bg-brand-black hover:bg-brand-black/50 border-none text-white"
      >
        Configurar punto de venta
      </router-link>

      <router-link
        :to="{ name: 'InitialConfig' }"
        role="button"
        class="btn w-[280px] bg-brand-white hover:bg-brand-pink hover:text-white border-none text-brand-pink"
      >
        Empezar desde cero una cuenta
      </router-link>

      <p class="text-center text-white-1 text-sm font-bold mt-4">
        Si tienes dudas, puedes consultar nuestra sección <br>
        de <a class="text-brand-black underline" href="#">documentación</a> en
        nuestro sitio web.
      </p>
    </div>

    <div class="w-full flex justify-between text-white-1">
      <a href="#" class="hover:underline">mitiendapos.mx</a>
      <a href="#" class="flex items-center gap-2 hover:underline">
        <icon-lifebuoy class="w-6 h-6" />
        ¿Necesitas ayuda?
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconLifebuoy } from '@tabler/icons-vue'
</script>

<style scoped></style>
