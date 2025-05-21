const { ipcMain } = require('electron')
const companyRepository = require('./companyRepository.cjs')

ipcMain.on('get_company', async (event) => {
  const response = await companyRepository.getCompany()
  event.reply('get_company', response)
})