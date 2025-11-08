import { CashRegister } from "@/api/interfaces"
import { useCashRegisterStore } from "@/stores/cashRegisterStore"
import { storeToRefs } from "pinia"

export const useCashRegister = () => {
  const cashRegisterStore = useCashRegisterStore()
  const { cashRegister, isCashRegisterOpen } = storeToRefs(cashRegisterStore)

  function setCashRegister(newCashRegister: CashRegister) {
    cashRegisterStore.setCashRegister(newCashRegister)
  }

  function getMovementReasonLabel (reason: string) {
    switch (reason) {
      // Deposit reasons (income)
      case 'sales':
        return 'Ingreso por ventas'
      case 'initial':
        return 'Fondo inicial'
      // Withdrawal reasons (withdraw)
      case 'expenses':
        return 'Gastos operativos'
      case 'refund':
        return 'Devolución a cliente'
      // Shared reasons (both income and withdraw)
      case 'change':
        return 'Cambio para caja'
      case 'other':
        return 'Otro'
      default:
        return 'Otro'
    }
  }
  
  return {
    cashRegister,
    isCashRegisterOpen,
    setCashRegister,
    getMovementReasonLabel,
  }
}