const { ipcMain } = require('electron')
const providersRepository = require('./providersRepository.cjs')

ipcMain.on('create_provider', async (event, provider) => {
  const res = await providersRepository.createProvider(provider)
  event.reply('create_provider', res)
})

ipcMain.on('update_provider', async (event, id, data) => {
  const res = await providersRepository.updateProvider(id, data)
  event.reply('update_provider', res)
})

ipcMain.on('delete_provider', async (event, id) => {
  const res = await providersRepository.deleteProvider(id)
  event.reply('delete_provider', res)
})

ipcMain.on('get_providers', async (event) => {
  const res = await providersRepository.getProviders()
  event.reply('get_providers', res)
})

ipcMain.on('get_provider_by_id', async (event, id) => {
  const res = await providersRepository.getProviderById(id)
  event.reply('get_provider_by_id', res)
})
