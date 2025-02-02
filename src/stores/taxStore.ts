import { defineStore } from "pinia"
import { Tax } from "@/api/interfaces"
import { ref } from "vue"

export const useTaxStore = defineStore('tax', () => {
  const taxes = ref<Tax[]>([])

  const setTaxes = (newTaxes: Tax[]) => {
    taxes.value = newTaxes
  }


  return {
    taxes,
    setTaxes,
  }
})