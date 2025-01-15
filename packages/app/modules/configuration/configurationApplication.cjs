const { ipcMain } = require('electron')
const { getConfiguration } = require('./configurationRepository.cjs')
const logger = require('../../helpers/logger.cjs')

ipcMain.on('get_configuration', async (event) => {
  const response = await getConfiguration()
  event.reply('get_configuration', response)
})