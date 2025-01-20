import { Configuration, Response, StartSessionParams, CashRegister, GeneratedFolio, CashRegisterState } from '@/api/interfaces'

export const getVersion = async (callback: any) => window.electron.getVersion(callback)

/* Sellers */
export const getSellers = async (callback: any) => window.electron.getSellers(callback)
export const startSession = async (params: StartSessionParams, callback: any) => window.electron.startSession(params, callback)

/* Sales */
export const createSale = async (data: any, callback: any) => window.electron.createSale(data, callback)
export const getSales = async (callback: any) => window.electron.getSales(callback)
export const generateSaleFolio = async (): Promise<Response<GeneratedFolio>> => window.electron.generateSaleFolio()

/* Products */
export const getProducts = async (callback: any) => window.electron.getActiveProducts(callback)
export const getProductCategories = async (callback: any) => window.electron.getProductCategories(callback)
export const getProductsByCategory = async (category: string, callback: any) => window.electron.getProductsByCategory(category, callback)

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
