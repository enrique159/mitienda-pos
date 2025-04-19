const { ipcMain } = require('electron')
const knex = require('knex')(require('../../database/knexfile.cjs'))
const cashRegisterAuditsRepository = require('./cashRegisterAuditsRepository.cjs')
const cashRegisterRepository = require('../cash_registers/cashRegistersRepository.cjs')

const ClosureType = Object.freeze({
  FULL: 'full',
  PARTIAL: 'partial',
})

ipcMain.on("create_cash_register_audit", async(event, data) => {
  const response = await cashRegisterAuditsRepository.createCashRegisterAudit(data)
  if (response.success && data.closure === ClosureType.FULL) {
    const updateResponse = await cashRegisterRepository.closeCashRegister({
      id_user_closing: data.id_user,
      id: data.id_cash_register,
      closing_date: knex.fn.now(),
    })
    if (!updateResponse.success) {
      response.success = false
      response.message = updateResponse.message
      response.data = updateResponse.data
    }
  }
  event.reply("create_cash_register_audit", response)
})