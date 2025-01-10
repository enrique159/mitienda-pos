import { Branch } from "@/api/interfaces";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useBranchStore = defineStore('branch', () => {
  const branch = ref<Branch>({} as Branch)

  const setBranch = (newBranch: Branch) => {
    branch.value = newBranch
  }

  const updateBranch = (newBranch: Partial<Branch>) => {
    branch.value = { ...branch.value, ...newBranch }
  }

  return {
    branch,
    setBranch,
    updateBranch,
  }
})