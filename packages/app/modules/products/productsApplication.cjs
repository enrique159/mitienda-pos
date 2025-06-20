const { ipcMain } = require('electron')
const productsRepository = require('./productsRepository.cjs')

ipcMain.on('create_product', async (event, product) => {
  const response = await productsRepository.createProduct(product)
  event.reply('create_product', response)
})

ipcMain.on('delete_product', async (event, productId) => {
  const response = await productsRepository.deleteProduct(productId)
  event.reply('delete_product', response)
})

ipcMain.on('get_products', async (event) => {
  const response = await productsRepository.getProducts()
  event.reply('get_products', response)
})

ipcMain.on('get_active_products', async (event) => {
  const response = await productsRepository.getActiveProducts()
  event.reply('get_active_products', response)
})

ipcMain.on('get_products_by_category', async (event, categoryId) => {
  const response = await productsRepository.getProductsByCategory(categoryId)
  event.reply('get_products_by_category', response)
})