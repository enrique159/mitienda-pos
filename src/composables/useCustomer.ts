import { Customer } from "@/api/interfaces"
import { useCustomerStore } from "@/stores/customerStore"
import { storeToRefs } from "pinia"
import { computed } from "vue"

export const useCustomer = () => {
  const customerStore = useCustomerStore()
  const { customers, customerCurrentSale } = storeToRefs(customerStore)

  const getActiveCustomers = computed(() => {
    return customers.value.filter((customer) => customer.status === 'active')
  })

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
    getActiveCustomers,
    customerCurrentSale,
    setCustomerCurrentSale,
    clearCustomerCurrentSale,
  }
}