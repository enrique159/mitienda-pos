import { Configuration, Response, StartSessionParams, CashRegister, GeneratedFolio, CashRegisterState, Customer, CreateCustomer, Tax, CreateProduct, CreateDiscount, Discount, UpdateDiscount, CreateCashMovement, Provider, CreateProvider, PurchaseOrder, CreatePurchaseOrder, CreatePurchaseOrderPayload, AiModel, CreateAiModel, UpdateAiModel } from '@/api/interfaces'
import { CreateCashRegisterAudit } from '../interfaces/cashRegisterAudits'
import { PurchaseOrderItem, PurchaseOrderStatus } from '../interfaces/purchase_orders'

export const getVersion = async (callback: any) => window.electron.getVersion(callback)
export const openExternalLink = async (url: string) => window.electron.openExternalLink(url)

/* Company */
export const getCompany = async (callback: any) => window.electron.getCompany(callback)

/* Sellers */
export const getSellers = async (callback: any) => window.electron.getSellers(callback)
export const startSession = async (params: StartSessionParams, callback: any) => window.electron.startSession(params, callback)
export const closeSession = async (sellerId: string) => window.electron.closeSession(sellerId)

/* Sales */
export const createSale = async (data: any, callback: any) => window.electron.createSale(data, callback)
export const getSales = async (callback: any) => window.electron.getSales(callback)
export const getSalesInTurn = async (idCashRegister: string, callback: any) => window.electron.getSalesInTurn(idCashRegister, callback)
export const generateSaleFolio = async (): Promise<Response<GeneratedFolio>> => window.electron.generateSaleFolio()

/* Categories */
export const getCategories = async (callback: any) => window.electron.getCategories(callback)
export const createCategory = async (data: any, callback: any) => window.electron.createCategory(data, callback)
export const updateCategory = async (data: any, callback: any) => window.electron.updateCategory(data, callback)
export const deleteCategory = async (id: string, callback: any) => window.electron.deleteCategory(id, callback)

/* Products */
export const getProducts = async (callback: any) => window.electron.getActiveProducts(callback)
export const getAllProducts = async (callback: any) => window.electron.getProducts(callback)
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

/* Providers */
export const getProviders = async (callback: any): Promise<Response<Provider[]>> => window.electron.getProviders(callback)
export const createProvider = async (data: CreateProvider, callback: any) => window.electron.createProvider(data, callback)
export const updateProvider = async (data: Provider, callback: any) => window.electron.updateProvider(data, callback)
export const deleteProvider = async (id: string, callback: any) => window.electron.deleteProvider(id, callback)
export const getProviderById = async (id: string, callback: any) => window.electron.getProviderById(id, callback)

/* Purchase Orders */
export const getPurchaseOrders = async (callback: any): Promise<Response<PurchaseOrder[]>> => window.electron.getPurchaseOrders(callback)
export const createPurchaseOrder = async (data: CreatePurchaseOrderPayload, callback: any) => window.electron.createPurchaseOrder(data, callback)
export const updatePurchaseOrder = async (data: { id: string, purchaseOrder: Partial<PurchaseOrder>}, callback: any) => window.electron.updatePurchaseOrder(data, callback)
export const updatePurchaseOrderItem = async (data: { id: string, purchaseOrderItem: Partial<PurchaseOrderItem> }, callback: any) => window.electron.updatePurchaseOrderItem(data, callback)
export const updatePurchaseOrderItems = async (items: Array<Partial<PurchaseOrderItem>>, callback: any) => window.electron.updatePurchaseOrderItems(items, callback)
export const updatePurchaseOrderStatus = async (data: { id: string, status: PurchaseOrderStatus }, callback: any) => window.electron.updatePurchaseOrderStatus(data, callback)
export const deletePurchaseOrder = async (id: string, callback: any) => window.electron.deletePurchaseOrder(id, callback)

/* Branches */
export const getBranchInfo = async (callback: any) => window.electron.getBranchInfo(callback)

/* Cash Register */
export const getCashRegisterActive = async (): Promise<Response<any>> => window.electron.getCashRegisterActive()
export const getCurrentCashRegisterState = async (): Promise<Response<CashRegisterState>> => window.electron.getCurrentCashRegisterState()
export const openCashRegister = async (data: Partial<CashRegister> ,callback: any) => window.electron.createCashRegister(data, callback)
export const closeCashRegister = async (data: CreateCashRegisterAudit, callback: any) => window.electron.createCashRegisterAudit(data, callback)

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

/* AI Models */
export const getAiModels = async (callback: any): Promise<Response<AiModel[]>> => window.electron.getAiModels(callback)
export const getAiModelById = async (id: string, callback: any): Promise<Response<AiModel>> => window.electron.getAiModelById(id, callback)
export const createAiModel = async (aiModel: CreateAiModel, callback: any): Promise<Response<AiModel>> => window.electron.createAiModel(aiModel, callback)
export const updateAiModel = async (data: { id: string, aiModel: UpdateAiModel }, callback: any): Promise<Response<AiModel>> => window.electron.updateAiModel(data, callback)
export const deleteAiModel = async (id: string, callback: any): Promise<Response<AiModel>> => window.electron.deleteAiModel(id, callback)
export const updateAiModelStatus = async (data: { id: string, status: 'active' | 'inactive' }, callback: any): Promise<Response<AiModel>> => window.electron.updateAiModelStatus(data, callback)
export const setDefaultAiModel = async (data: { id: string, companyId: string }, callback: any): Promise<Response<AiModel>> => window.electron.setDefaultAiModel(data, callback)