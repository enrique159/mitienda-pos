import { Configuration, Response, StartSessionParams, CashRegister, GeneratedFolio, CashRegisterState, Customer, CreateCustomer, Tax } from '@/api/interfaces'

export const getVersion = async (callback: any) => window.electron.getVersion(callback)

/* Sellers */
export const getSellers = async (callback: any) => window.electron.getSellers(callback)
export const startSession = async (params: StartSessionParams, callback: any) => window.electron.startSession(params, callback)

/* Sales */
export const createSale = async (data: any, callback: any) => window.electron.createSale(data, callback)
export const getSales = async (callback: any) => window.electron.getSales(callback)
export const generateSaleFolio = async (): Promise<Response<GeneratedFolio>> => window.electron.generateSaleFolio()

/* Categories */
export const getCategories = async (callback: any) => window.electron.getCategories(callback)

/* Products */
export const getProducts = async (callback: any) => window.electron.getActiveProducts(callback)
export const getProductCategories = async (callback: any) => window.electron.getProductCategories(callback)
export const getProductsByCategory = async (categoryId: string , callback: any) => window.electron.getProductsByCategory(categoryId, callback)

/* Taxes */
export const getTaxes = async (): Promise<Response<Tax[]>> => window.electron.getTaxes()
export const createTax = async (data: any, callback: any) => window.electron.createTax(data, callback)
export const deleteTax = async (id: string, callback: any) => window.electron.deleteTax(id, callback)

/* Branches */
export const getBranchInfo = async (callback: any) => window.electron.getBranchInfo(callback)

/* Cash Register */
export const getCashRegisterActive = async (): Promise<Response<any>> => window.electron.getCashRegisterActive()
export const getCurrentCashRegisterState = async (): Promise<Response<CashRegisterState>> => window.electron.getCurrentCashRegisterState()
export const openCashRegister = async (data: Partial<CashRegister> ,callback: any) => window.electron.createCashRegister(data, callback)

/* Configuration */
export const getConfiguration = async (callback: any) => window.electron.getConfiguration(callback)
export const updateConfiguration = async (configuration: Configuration, callback: any) => window.electron.updateConfiguration(configuration, callback)
export const createConfiguration = async (configuration: Configuration, callback: any) => window.electron.createConfiguration(configuration, callback)
export const exportDatabase = async (callback: any) => window.electron.exportDatabase(callback)
export const importDatabase = async (data: any, callback: any) => window.electron.importDatabase(data, callback)

/* Customers */
export const getCustomers = async (): Promise<Response<Customer[]>> => window.electron.getCustomers()
export const createCustomer = async (customer: CreateCustomer, callback: any): Promise<Response<Customer>> => window.electron.createCustomer(customer, callback)
export const updateCustomer = async (customer: Customer, callback: any): Promise<Response<Customer>> => window.electron.updateCustomer(customer, callback)
export const deleteCustomer = async (customerId: string, callback: any): Promise<Response<Customer>> => window.electron.deleteCustomer(customerId, callback)