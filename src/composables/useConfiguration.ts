import { Configuration } from "@/api/interfaces";
import { useConfigurationStore } from "@/stores/configurationStore";
import { storeToRefs } from "pinia";

export const useConfiguration = () => {
  const configurationStore = useConfigurationStore()

  const { configuration } = storeToRefs(configurationStore)

  function setConfiguration(config: Configuration) {
    configurationStore.setConfiguration(config)
  }

  return {
    configuration,
    setConfiguration
  }
}