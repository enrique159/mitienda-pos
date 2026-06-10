import {
  Response,
  StartSessionParams,
  CreateSeller,
  UpdateSeller,
} from '@/api/interfaces'

export const createSeller = async (seller: CreateSeller, callback: any) =>
  window.electron.createSeller(seller, callback)
export const updateSeller = async (seller: UpdateSeller, callback: any) =>
  window.electron.updateSeller(seller, callback)
export const updatePermissionsSeller = async (
  params: { id: string; permissions: number },
  callback: any
) => window.electron.updatePermissionsSeller(params, callback)
export const deleteSellerById = async (id: string, callback: any) =>
  window.electron.deleteSellerById(id, callback)
export const getSellers = async (callback: any) =>
  window.electron.getSellers(callback)
export const getAllSellers = async (callback: any) =>
  window.electron.getAllSellers(callback)
export const getSellerById = async (id: string, callback: any) =>
  window.electron.getSellerById(id, callback)
export const getPosSellers = async (callback: any) =>
  window.electron.getPosSellers(callback)
export const startSession = async (params: StartSessionParams, callback: any) =>
  window.electron.startSession(params, callback)
export const closeSession = async (sellerId: string) =>
  window.electron.closeSession(sellerId)
