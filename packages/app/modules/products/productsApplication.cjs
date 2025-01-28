const { ipcMain } = require('electron')
const productsRepository = require('./productsRepository.cjs')


ipcMain.on('get_active_products', async (event) => {
  const response = await productsRepository.getActiveProducts()
  event.reply('get_active_products', response)
})

ipcMain.on('get_product_categories', async (event) => {
  const response = await productsRepository.getProductCategories()
  event.reply('get_product_categories', response)
})

ipcMain.on('get_products_by_category', async (event, categoryId) => {
  const response = await productsRepository.getProductsByCategory(categoryId)
  event.reply('get_products_by_category', response)
})