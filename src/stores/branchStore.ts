import { generateSaleFolio } from "@/api/electron"
import { Branch } from "@/api/interfaces"
import { defineStore } from "pinia"
import { computed, ref } from "vue"

export const useBranchStore = defineStore('branch', () => {
  const branch = ref<Branch>({} as Branch)
  const saleFolio = ref<string>('')

  const timezone = computed(() => branch.value.timezone)

  const setBranch = (newBranch: Branch) => {
    branch.value = newBranch
  }

  const generateFolio = async () => {
    const response = await generateSaleFolio()
    if (response.success) {
      saleFolio.value = response.response.folio
    } else {
      saleFolio.value = ''
    }
  }

  const updateBranch = (newBranch: Partial<Branch>) => {
    branch.value = { ...branch.value, ...newBranch }
  }

  return {
    branch,
    setBranch,
    updateBranch,
    timezone,
    saleFolio,
    generateFolio,
  }
})