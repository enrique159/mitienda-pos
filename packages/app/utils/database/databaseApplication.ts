import { ipcMain } from 'electron'
import { cleanAllTables } from '../../helpers/index.js'

ipcMain.on("clear_database", async(event, payload) => {
  const response = await cleanAllTables({ excludedTables: payload?.excludedTables || ['taxes'] })
  event.reply('clear_database', response)
})
