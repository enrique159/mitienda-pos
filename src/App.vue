<template>
  <main id="app" class="bg-white-1">
    <router-view />
  </main>
</template>

<script setup lang="ts">
import { useTitle } from '@vueuse/core';
import { getVersion, getConfiguration } from '@/api/electron';
import { Configuration, Response } from './api/interfaces';
import { useConfiguration } from './composables/useConfiguration';

const { setConfiguration } = useConfiguration();

getVersion((response: string) => {
  useTitle(`Mi Tienda POS - v${response}`);
})

getConfiguration((response: Response<Configuration>) => {
  if (response.success) {
    setConfiguration(response.response);
  }
})
</script>

<style>
#app {
  width: 100vw;
  height: 100vh;
}
</style>
