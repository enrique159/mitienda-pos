import { Response, Provider, CreateProvider } from '@/api/interfaces'

export const getProviders = async (callback: any): Promise<Response<Provider[]>> => window.electron.getProviders(callback)
export const createProvider = async (data: CreateProvider, callback: any) => window.electron.createProvider(data, callback)
export const updateProvider = async (data: Provider, callback: any) => window.electron.updateProvider(data, callback)
export const deleteProvider = async (id: string, callback: any) => window.electron.deleteProvider(id, callback)
export const getProviderById = async (id: string, callback: any) => window.electron.getProviderById(id, callback)
