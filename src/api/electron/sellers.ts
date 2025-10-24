import { Response, StartSessionParams } from '@/api/interfaces'

export const getSellers = async (callback: any) => window.electron.getSellers(callback)
export const getPosSellers = async (callback: any) => window.electron.getPosSellers(callback)
export const startSession = async (params: StartSessionParams, callback: any) => window.electron.startSession(params, callback)
export const closeSession = async (sellerId: string) => window.electron.closeSession(sellerId)
