import { defineStore } from "pinia"
import { AiModel, Configuration } from "@/api/interfaces"
import { ref } from "vue"

export const useConfigurationStore = defineStore('configuration', () => {
  const configuration = ref<Configuration>({} as Configuration)

  const aiModels = ref<AiModel[]>([])

  const setConfiguration = (config: Configuration) => {
    configuration.value = config
  }

  const setAiModels = (models: AiModel[]) => {
    aiModels.value = models
  }

  return {
    configuration,
    setConfiguration,
    aiModels,
    setAiModels,
  }
})