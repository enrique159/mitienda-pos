import { Customer } from "@/api/interfaces"
import { useCustomerStore } from "@/stores/customerStore"
import { storeToRefs } from "pinia"

export const useCustomer = () => {
  const customerStore = useCustomerStore()
  const { customers, customerCurrentSale } = storeToRefs(customerStore)

  const setCustomers = (newCustomers: Customer[]) => {
    customerStore.setCustomers(newCustomers)
  }

  const setCustomerCurrentSale = (customer: Customer) => {
    customerStore.setCustomerCurrentSale(customer)
  }

  const clearCustomerCurrentSale = async() => {
    await customerStore.clearCustomerCurrentSale()
  }

  return {
    customers,
    setCustomers,
    customerCurrentSale,
    setCustomerCurrentSale,
    clearCustomerCurrentSale,
  }
}