import { Provider } from "@/api/interfaces"
import { useProviderStore } from "@/stores/providerStore"
import { storeToRefs } from "pinia"

export const useProvider = () => {
  const providerStore = useProviderStore()
  const { providers } = storeToRefs(providerStore)

  function setProviders(newProviders: Provider[]) {
    providerStore.setProviders(newProviders)
  }

  return {
    providers,
    setProviders,
  }
}