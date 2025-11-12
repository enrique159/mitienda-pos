import { Response, StartSessionParams, CreateSeller } from '@/api/interfaces'

export const createSeller = async (seller: CreateSeller, callback: any) => window.electron.createSeller(seller, callback)
export const getSellers = async (callback: any) => window.electron.getSellers(callback)
export const getAllSellers = async (callback: any) => window.electron.getAllSellers(callback)
export const getPosSellers = async (callback: any) => window.electron.getPosSellers(callback)
export const startSession = async (params: StartSessionParams, callback: any) => window.electron.startSession(params, callback)
export const closeSession = async (sellerId: string) => window.electron.closeSession(sellerId)
