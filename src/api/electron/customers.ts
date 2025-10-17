import { Response, Customer, CreateCustomer } from '@/api/interfaces'

export const getCustomers = async (): Promise<Response<Customer[]>> => window.electron.getCustomers()
export const createCustomer = async (customer: CreateCustomer, callback: any): Promise<Response<Customer>> => window.electron.createCustomer(customer, callback)
export const updateCustomer = async (customer: Customer, callback: any): Promise<Response<Customer>> => window.electron.updateCustomer(customer, callback)
export const deleteCustomer = async (customerId: string, callback: any): Promise<Response<Customer>> => window.electron.deleteCustomer(customerId, callback)
