const { ipcMain } = require('electron')
const { getTaxes, createTax, deleteTax } = require('./taxesRepository.cjs')

ipcMain.on('get_taxes', async (event) => {
  const response = await getTaxes()
  event.returnValue = response
})

ipcMain.on('create_tax', async (event, data) => {
  const response = await createTax(data)
  event.reply('create_tax', response)
})

ipcMain.on('delete_tax', async (event, id) => {
  const response = await deleteTax(id)
  event.reply('delete_tax', response)
})