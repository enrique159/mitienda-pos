const { ipcMain } = require('electron')
const configurationRepository = require('./configurationRepository.cjs')
const logger = require('../../helpers/logger.cjs')

ipcMain.on('get_configuration', async (event) => {
  const response = await configurationRepository.getConfiguration()
  event.reply('get_configuration', response)
})

ipcMain.on('set_default_printer', async (event, printerName) => {
  const response = await configurationRepository.setDefaultPrinter(printerName)
  event.reply('set_default_printer', response)
})