<template>
  <div
    class="w-full h-screen bg-white-1 flex flex-col items-center justify-center"
  >
    <h1 class="text-4xl font-bold text-black-1">
      ¡Ups!
    </h1>
    <p class="text-black-2 text-center">
      Hubo un error al intentar abrir alguna vista. <br>
      Puedes reportar este problema a <router-link to="/main/settings/support" class="text-brand-blue underline">
        soporte técnico
      </router-link>
    </p>
    <button
      @click="$router.back()"
      class="btn bg-brand-pink text-white hover:bg-brand-pink/80 mt-4"
    >
      Volver a la página anterior
    </button>
  </div>
</template>
