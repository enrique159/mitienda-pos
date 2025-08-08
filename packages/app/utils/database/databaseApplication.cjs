const { ipcMain } = require('electron')
const { cleanAllTables } = require('../../helpers/index.cjs')

ipcMain.on("clear_database", async(event, payload) => {
  const response = await cleanAllTables({ excludedTables: payload?.excludedTables || ['taxes'] })
  event.reply('clear_database', response)
})