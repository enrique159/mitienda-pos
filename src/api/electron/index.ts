import { Configuration, Response, StartSessionParams, CashRegister, GeneratedFolio, CashRegisterState, Customer, CreateCustomer, Tax, CreateProduct, CreateDiscount, Discount, UpdateDiscount, CreateCashMovement } from '@/api/interfaces'

export const getVersion = async (callback: any) => window.electron.getVersion(callback)

/* Sellers */
export const getSellers = async (callback: any) => window.electron.getSellers(callback)
export const startSession = async (params: StartSessionParams, callback: any) => window.electron.startSession(params, callback)
export const closeSession = async (sellerId: string) => window.electron.closeSession(sellerId)

/* Sales */
export const createSale = async (data: any, callback: any) => window.electron.createSale(data, callback)
export const getSales = async (callback: any) => window.electron.getSales(callback)
export const generateSaleFolio = async (): Promise<Response<GeneratedFolio>> => window.electron.generateSaleFolio()

/* Categories */
export const getCategories = async (callback: any) => window.electron.getCategories(callback)
export const createCategory = async (data: any, callback: any) => window.electron.createCategory(data, callback)
export const updateCategory = async (data: any, callback: any) => window.electron.updateCategory(data, callback)
export const deleteCategory = async (id: string, callback: any) => window.electron.deleteCategory(id, callback)

/* Products */
export const getProducts = async (callback: any) => window.electron.getActiveProducts(callback)
export const getProductsByCategory = async (categoryId: string , callback: any) => window.electron.getProductsByCategory(categoryId, callback)
export const createProduct = async (product: CreateProduct, callback: any) => window.electron.createProduct(product, callback)
export const deleteProduct = async (productId: string, callback: any) => window.electron.deleteProduct(productId, callback)

/* Discounts */
export const getDiscounts = async (callback: any): Promise<Response<Discount[]>> => window.electron.getDiscounts(callback)
export const createDiscount = async (data: CreateDiscount, callback: any) => window.electron.createDiscount(data, callback)
export const updateDiscount = async (discount: UpdateDiscount, callback: any) => window.electron.updateDiscount(discount, callback)
export const deleteDiscount = async (discountId: string, callback: any) => window.electron.deleteDiscount(discountId, callback)
export const getDiscountProducts = async (discountId: string, callback: any) => window.electron.getDiscountProducts(discountId, callback)
export const attachProductsToDiscount = async (discountId: string, productsId: Array<string>, callback: any) => window.electron.createDiscountProduct(discountId, productsId, callback)

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

/* Cash Movements */
export const createCashMovement = async (data: CreateCashMovement, callback: any) => window.electron.createCashMovement(data, callback)

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