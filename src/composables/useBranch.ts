import { Branch } from "@/api/interfaces";
import { useBranchStore } from "@/stores/branchStore";
import { storeToRefs } from "pinia";

export const useBranch = () => {
  const branchStore = useBranchStore()
  const { branch } = storeToRefs(branchStore)

  // Functions
  const setBranch = (newBranch: Branch) => branchStore.setBranch(newBranch)
  const updateBranch = (newBranch: Partial<Branch>) => branchStore.updateBranch(newBranch)

  return {
    branch,
    setBranch,
    updateBranch,
  }
}