import { Customer } from "@/api/interfaces"
import { defineStore } from "pinia"
import { ref } from "vue"


export const useCustomerStore = defineStore('customer', () => {
  const customers = ref<Customer[]>([])
  const customerCurrentSale = ref<Customer | null>(null)

  const setCustomers = (newCustomers: Customer[]) => {
    customers.value = newCustomers
  }

  const setCustomerCurrentSale = (customer: Customer) => {
    customerCurrentSale.value = customer
  }

  const clearCustomerCurrentSale = () => {
    customerCurrentSale.value = null
  }

  return {
    customers,
    customerCurrentSale,
    setCustomers,

    setCustomerCurrentSale,
    clearCustomerCurrentSale,
  }
})