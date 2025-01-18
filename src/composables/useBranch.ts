import { Branch } from "@/api/interfaces"
import { useBranchStore } from "@/stores/branchStore"
import { storeToRefs } from "pinia"
import { computed } from "vue"

export const useBranch = () => {
  const branchStore = useBranchStore()
  const { branch, timezone, saleFolio } = storeToRefs(branchStore)

  const isPinCancelSaleRequired = computed(() => branch.value.pin_cancel_sale_required)

  // Functions
  const setBranch = (newBranch: Branch) => branchStore.setBranch(newBranch)
  const updateBranch = (newBranch: Partial<Branch>) => branchStore.updateBranch(newBranch)
  const generateFolio = () => branchStore.generateFolio()
  const comparePinCancelSale = (pin: string) => branch.value.pin_cancel_sale === pin

  return {
    branch,
    timezone,
    setBranch,
    updateBranch,
    saleFolio,
    generateFolio,
    isPinCancelSaleRequired,
    comparePinCancelSale,
  }
}