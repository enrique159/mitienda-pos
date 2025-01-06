const { ipcMain } = require('electron')
const { getActiveProducts } = require('./productsRepository.cjs')


ipcMain.on('get_active_products', async (event) => {
  const response = await getActiveProducts()
  event.reply('get_active_products', response)
})