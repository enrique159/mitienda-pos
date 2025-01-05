<template>
  <main id="app" class="bg-white-1">
    <router-view />
  </main>
</template>

<script setup lang="ts">
import { useTitle } from '@vueuse/core';
import { getVersion } from '@/api/electron';

getVersion((response: string) => {
  useTitle(`Mi Tienda POS - v${response}`);
})
</script>

<style>
#app {
  width: 100vw;
  height: 100vh;
}
</style>
