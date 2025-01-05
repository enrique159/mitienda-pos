const { ipcMain } = require('electron')
const { startSession, getSellers } = require('./sellersRepository.cjs')

ipcMain.on('start_session', async (event, data) => {
  const response = await startSession(data)
  event.reply('start_session', response)
})

ipcMain.on('get_sellers', async (event) => {
  const response = await getSellers()
  event.reply('get_sellers', response)
})