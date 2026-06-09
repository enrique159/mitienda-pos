import { ipcMain } from 'electron'
import * as reportsRepository from './reportsRepository.js'

ipcMain.on('get_reports', async (event, filters) => {
  const result = await reportsRepository.getReports(filters)
  event.reply('get_reports', result)
})
