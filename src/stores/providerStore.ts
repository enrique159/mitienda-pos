import { Provider } from "@/api/interfaces"
import { defineStore } from "pinia"
import { ref } from "vue"

export const useProviderStore = defineStore('provider', () => {
  const providers = ref<Provider[]>([])

  const setProviders = (newProviders: Provider[]) => {
    providers.value = newProviders
  }

  return {
    providers,
    setProviders,
  }
})
