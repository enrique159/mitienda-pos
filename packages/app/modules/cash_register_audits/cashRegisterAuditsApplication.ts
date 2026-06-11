import { ipcMain } from 'electron'
import knexFactory from 'knex'
import knexConfig from '../../database/knexfile.js'
const knex = knexFactory(knexConfig)
import * as cashRegisterAuditsRepository from './cashRegisterAuditsRepository.js'
import * as cashRegisterRepository from '../cash_registers/cashRegistersRepository.js'

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
      response.response = updateResponse.response
    }
  }
  event.reply("create_cash_register_audit", response)
})

ipcMain.on("get_cash_register_audits", async(event, filters) => {
  const cashRegisterAudits = await cashRegisterAuditsRepository.getCashRegisterAudits(filters)
  event.returnValue = cashRegisterAudits
})
