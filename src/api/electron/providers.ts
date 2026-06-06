import { Response, Provider, CreateProvider } from '@/api/interfaces'

type ElectronCallback<T> = (response: T) => void

export const getProviders = async (callback: ElectronCallback<Response<Provider[]>>): Promise<void> => window.electron.getProviders(callback)
export const createProvider = async (data: CreateProvider, callback: ElectronCallback<Response<Provider[]>>): Promise<void> => window.electron.createProvider(data, callback)
export const updateProvider = async (data: Provider, callback: ElectronCallback<Response<Provider[]>>): Promise<void> => window.electron.updateProvider(data, callback)
export const deleteProvider = async (id: string, callback: ElectronCallback<Response<Provider>>): Promise<void> => window.electron.deleteProvider(id, callback)
export const getProviderById = async (id: string, callback: ElectronCallback<Response<Provider | null>>): Promise<void> => window.electron.getProviderById(id, callback)
