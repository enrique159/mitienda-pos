const { ipcMain } = require('electron')
const categoriesRepository = require('./categoriesRepository.cjs')


ipcMain.on('get_categories', async (event) => {
  const response = await categoriesRepository.getCategories()
  event.reply('get_categories', response)
})
