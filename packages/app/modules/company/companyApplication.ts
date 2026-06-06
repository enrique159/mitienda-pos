import { ipcMain } from 'electron'
import * as companyRepository from './companyRepository.js'

ipcMain.on('get_pos_company', async (event) => {
  const response = await companyRepository.getPosCompany()
  event.reply('get_pos_company', response)
})

ipcMain.on('get_company', async (event) => {
  const response = await companyRepository.getCompany()
  event.reply('get_company', response)
})
