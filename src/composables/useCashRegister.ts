import { CashRegister } from "@/api/interfaces";
import { useCashRegisterStore } from "@/stores/cashRegisterStore";
import { storeToRefs } from "pinia";

export const useCashRegister = () => {
  const cashRegisterStore = useCashRegisterStore()
  const { cashRegister, isCashRegisterOpen } = storeToRefs(cashRegisterStore)

  function setCashRegister(newCashRegister: CashRegister) {
    cashRegisterStore.setCashRegister(newCashRegister)
  }

  return {
    cashRegister,
    isCashRegisterOpen,
    setCashRegister,
  }
}