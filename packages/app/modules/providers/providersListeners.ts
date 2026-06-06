import { ipcRenderer, type IpcRendererEvent } from 'electron'
import type { AppResponse, IpcCallback, UUID } from '../../shared/types'
import type { CreateProvider, Provider, UpdateProvider } from '../../shared/providerTypes'

const listenOnce = <T>(channel: string, callback: IpcCallback<T>): void => {
  ipcRenderer.removeAllListeners(channel)
  ipcRenderer.on(channel, (_: IpcRendererEvent, response: T) => callback(response))
}

export function createProvider(provider: CreateProvider, callback: IpcCallback<AppResponse<Provider[]>>): void {
  listenOnce('create_provider', callback)
  ipcRenderer.send('create_provider', provider)
}

export function updateProvider(data: UpdateProvider, callback: IpcCallback<AppResponse<Provider[]>>): void {
  listenOnce('update_provider', callback)
  ipcRenderer.send('update_provider', data)
}

export function deleteProvider(id: UUID, callback: IpcCallback<AppResponse<Provider>>): void {
  listenOnce('delete_provider', callback)
  ipcRenderer.send('delete_provider', id)
}

export function getProviders(callback: IpcCallback<AppResponse<Provider[]>>): void {
  listenOnce('get_providers', callback)
  ipcRenderer.send('get_providers')
}

export function getProviderById(id: UUID, callback: IpcCallback<AppResponse<Provider | null>>): void {
  listenOnce('get_provider_by_id', callback)
  ipcRenderer.send('get_provider_by_id', id)
}
