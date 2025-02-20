const { ipcMain } = require('electron')
const discountsRepository = require('./discountsRepository.cjs')

ipcMain.on('get_active_discounts', async (event) => {
  const response = await discountsRepository.getActiveDiscounts()
  event.returnValue = response
})

ipcMain.on('get_discounts', async (event) => {
  const response = await discountsRepository.getDiscounts()
  event.reply('get_discounts', response)
})

ipcMain.on('create_discount', async (event, discount) => {
  const response = await discountsRepository.createDiscount(discount)
  event.reply('create_discount', response)
})

ipcMain.on('create_discount_product', async (event, discountId, productsId) => {
  const response = await discountsRepository.createDiscountProduct(discountId, productsId)
  event.reply('create_discount_product', response)
})