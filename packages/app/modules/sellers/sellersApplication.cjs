const { ipcMain } = require('electron')
const sellerRepository = require('./sellersRepository.cjs')

ipcMain.on('start_session', async (event, data) => {
  const response = await sellerRepository.startSession(data)
  event.reply('start_session', response)
})

ipcMain.on('close_session', async (event, sellerId) => {
  const response = await sellerRepository.closeSession(sellerId)
  event.returnValue = response
})

ipcMain.on('get_sellers', async (event) => {
  const response = await sellerRepository.getSellers()
  event.reply('get_sellers', response)
})