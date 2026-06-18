import { ipcMain, type IpcMainEvent } from 'electron'
import type { UUID } from '../../shared/types'
import type { CreateProvider, UpdateProvider } from '../../shared/providerTypes'
import {
  createProvider,
  deleteProvider,
  getProviderById,
  getProviders,
  getProvidesActive,
  updateProvider,
} from './providersRepository'

ipcMain.on(
  'create_provider',
  async (event: IpcMainEvent, provider: CreateProvider) => {
    const res = await createProvider(provider)
    event.reply('create_provider', res)
  }
)

ipcMain.on(
  'update_provider',
  async (event: IpcMainEvent, data: UpdateProvider) => {
    const res = await updateProvider(data)
    event.reply('update_provider', res)
  }
)

ipcMain.on('delete_provider', async (event: IpcMainEvent, id: UUID) => {
  const res = await deleteProvider(id)
  event.reply('delete_provider', res)
})

ipcMain.on('get_providers', async (event: IpcMainEvent) => {
  const res = await getProviders()
  event.reply('get_providers', res)
})

ipcMain.on('get_provides_active', async (event: IpcMainEvent) => {
  const res = await getProvidesActive()
  event.reply('get_provides_active', res)
})

ipcMain.on('get_provider_by_id', async (event: IpcMainEvent, id: UUID) => {
  const res = await getProviderById(id)
  event.reply('get_provider_by_id', res)
})
