<template>
  <main id="app" class="bg-white-1">
    <router-view />
  </main>
</template>

<script setup lang="ts">
import { useTitle } from '@vueuse/core'
import { getVersion, getConfiguration } from '@/api/electron'
import { Configuration, Response } from './api/interfaces'
import { useConfiguration } from './composables/useConfiguration'
import { useRouter } from 'vue-router'

const router = useRouter()
const { setConfiguration, configuration } = useConfiguration()

getVersion((response: string) => {
  useTitle(`mitienda - v${response}`)
})


getConfiguration((response: Response<Configuration>) => {
  if (response.success) {
    setConfiguration(response.response)
    router.push({ name: configuration.value.configured ? 'SignInAsUser' : 'Login' })
  } else {
    router.push({ name: 'Login' })
  }
})
</script>

<style>
#app {
  width: 100vw;
  height: 100vh;
}
</style>
