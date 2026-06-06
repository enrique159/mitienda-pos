import { ipcMain } from 'electron'
import * as cashMovementsRepository from './cashMovementsRepository.js'

ipcMain.on("create_cash_movement", async(event, data) => {
  const response = await cashMovementsRepository.createCashMovement(data)
  event.reply("create_cash_movement", response)
})

ipcMain.on("get_movements_in_turn", async(event, cashRegisterId) => {
  const response = await cashMovementsRepository.getMovementsInTurn(cashRegisterId)
  event.reply("get_movements_in_turn", response)
})

