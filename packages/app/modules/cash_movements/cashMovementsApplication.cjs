const { ipcMain } = require('electron')
const cashMovementsRepository = require('./cashMovementsRepository.cjs')

ipcMain.on("create_cash_movement", async(event, data) => {
  const response = await cashMovementsRepository.createCashMovement(data)
  event.reply("create_cash_movement", response)
})