const { ipcMain } = require('electron')
const { startSession, getUsers } = require('./usersRepository.cjs')

ipcMain.on('start_session', async (event, data) => {
  const response = await startSession(data)
  event.reply('start_session', response)
})

ipcMain.on('get_users', async (event) => {
  const response = await getUsers()
  event.reply('get_users', response)
})