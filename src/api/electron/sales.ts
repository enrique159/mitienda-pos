import { Response, GeneratedFolio } from '@/api/interfaces'

export const createSale = async (data: any, callback: any) => window.electron.createSale(data, callback)
export const getSales = async (callback: any) => window.electron.getSales(callback)
export const getSalesInTurn = async (idCashRegister: string, callback: any) => window.electron.getSalesInTurn(idCashRegister, callback)
export const generateSaleFolio = async (): Promise<Response<GeneratedFolio>> => window.electron.generateSaleFolio()
