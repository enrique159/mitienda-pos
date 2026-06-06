import type { AppResponse, IpcCallback, UUID } from './types'
import type { CreateProvider, Provider, UpdateProvider } from './providerTypes'

export interface ElectronApi {
  createProvider(provider: CreateProvider, callback: IpcCallback<AppResponse<Provider[]>>): void
  updateProvider(provider: UpdateProvider, callback: IpcCallback<AppResponse<Provider[]>>): void
  deleteProvider(id: UUID, callback: IpcCallback<AppResponse<Provider>>): void
  getProviders(callback: IpcCallback<AppResponse<Provider[]>>): void
  getProviderById(id: UUID, callback: IpcCallback<AppResponse<Provider | null>>): void
  closeApp(): void
  restartApp(): void
  openExternalLink(url: string): Promise<void>
  onSystemSuspend(callback: () => void): () => void
  onSystemResume(callback: () => void): () => void
  [method: string]: any
}
