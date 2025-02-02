import { Tax } from "@/api/interfaces"
import { useTaxStore } from "@/stores/taxStore"
import { storeToRefs } from "pinia"

export const useTax = () => {
  const taxStore = useTaxStore()
  const { taxes } = storeToRefs(taxStore)

  function setTaxes(newTaxes: Tax[]) {
    taxStore.setTaxes(newTaxes)
  }

  return {
    taxes,
    setTaxes,
  }
}