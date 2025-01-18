import { CashRegister } from "@/api/interfaces"
import { defineStore } from "pinia"
import { computed, ref } from "vue"

export const useCashRegisterStore = defineStore('cashRegister', () => {
  const cashRegister = ref<CashRegister | null>(null)

  const isCashRegisterOpen = computed(() => cashRegister.value !== null && cashRegister.value.closing_date === null)

  const setCashRegister = (newCashRegister: CashRegister) => {
    cashRegister.value = newCashRegister
  }

  return {
    cashRegister,
    isCashRegisterOpen,
    setCashRegister,
  }
})