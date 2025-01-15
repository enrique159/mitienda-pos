import { defineStore } from "pinia";
import { Configuration } from "@/api/interfaces";
import { ref } from "vue";

export const useConfigurationStore = defineStore('configuration', () => {
  const configuration = ref<Configuration>({} as Configuration)

  const setConfiguration = (config: Configuration) => {
    configuration.value = config
  }

  return {
    configuration,
    setConfiguration
  }
})