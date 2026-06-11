import { Response, Customer, CreateCustomer, UpdateCustomer, UpdateCustomerCredit } from '@/api/interfaces'

export const getCustomers = async (): Promise<Response<Customer[]>> => window.electron.getCustomers()
export const createCustomer = async (customer: CreateCustomer, callback: any): Promise<Response<Customer>> => window.electron.createCustomer(customer, callback)
export const updateCustomer = async (customer: UpdateCustomer, callback: any): Promise<Response<Customer>> => window.electron.updateCustomer(customer, callback)
export const updateCustomerCredit = async (
  customerCredit: UpdateCustomerCredit,
  callback: any
): Promise<Response<Customer>> => window.electron.updateCustomer(customerCredit, callback)
export const deleteCustomer = async (customerId: string, callback: any): Promise<Response<Customer>> => window.electron.deleteCustomer(customerId, callback)
