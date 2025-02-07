const { ipcMain } = require('electron')
const categoriesRepository = require('./categoriesRepository.cjs')


ipcMain.on('get_categories', async (event) => {
  const response = await categoriesRepository.getCategories()
  event.reply('get_categories', response)
})

ipcMain.on('create_category', async (event, category) => {
  const response = await categoriesRepository.createCategory(category)
  event.reply('create_category', response)
})

ipcMain.on('update_category', async (event, category) => {
  const response = await categoriesRepository.updateCategory(category)
  event.reply('update_category', response)
})

ipcMain.on('delete_category', async (event, id) => {
  const response = await categoriesRepository.deleteCategory(id)
  event.reply('delete_category', response)
})