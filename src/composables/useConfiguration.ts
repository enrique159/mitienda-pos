import { AiModel, Configuration } from "@/api/interfaces"
import { useConfigurationStore } from "@/stores/configurationStore"
import { storeToRefs } from "pinia"
import { computed } from "vue"

export const useConfiguration = () => {
  const configurationStore = useConfigurationStore()

  const { configuration, aiModels } = storeToRefs(configurationStore)

  const defaultAiModel = computed(() => aiModels.value.find((model) => model.default))

  function setConfiguration(config: Configuration) {
    configurationStore.setConfiguration(config)
  }

  function setAiModels(aiModels: AiModel[]) {
    configurationStore.setAiModels(aiModels)
  }

  return {
    configuration,
    setConfiguration,
    aiModels,
    setAiModels,
    defaultAiModel,
  }
}