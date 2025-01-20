const { ipcMain } = require('electron')
const cashRegisterRepository = require('./cashRegistersRepository.cjs')

ipcMain.on("get_cash_register_active", async(event) => {
  const currentCashRegister = await cashRegisterRepository.getCashRegisterActive()
  event.returnValue = currentCashRegister
})

ipcMain.on("get_current_cash_register_state", async(event) => {
  const currentCashRegisterState = await cashRegisterRepository.getCurrentCashRegisterState()
  event.returnValue = currentCashRegisterState
})


ipcMain.on("create_cash_register", async(event, data) => {
  const response = await cashRegisterRepository.createCashRegister(data)
  event.reply("create_cash_register", response)
})