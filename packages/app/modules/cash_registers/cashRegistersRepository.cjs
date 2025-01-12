const knex = require('knex')(require('../../database/knexfile.cjs'))
const { response, logger } = require('../../helpers/index.cjs')

exports.createCashRegister = async function (data) {
  return await knex('cash_registers').insert(data).returning('*')
    .then((cashRegister) => {
      const cashRegisterData = Array.isArray(cashRegister) ? cashRegister[0] : cashRegister
      return response(true, 'Caja registradora creada', cashRegisterData)
    })
    .catch((err) => {
      logger.error({ type: 'CREATE CASH REGISTER ERROR', message: `${err}`, data: err })
      return response(false, 'Error al crear la caja registradora', err)
    })
}


exports.getCashRegisterActive = async function () {
  return await knex('cash_registers').select('cash_registers.*', 'open_sellers.name as open_user_name', 'close_sellers.name as close_user_name')
    .leftJoin('sellers as open_sellers', 'open_sellers.id', 'cash_registers.id_user_opening')
    .leftJoin('sellers as close_sellers', 'close_sellers.id', 'cash_registers.id_user_closing')
    .whereNull('closing_date')
    .orderBy('opening_date', 'desc')
    .limit(1)
    .then((cashRegister) => {
      if(Array.isArray(cashRegister) && cashRegister.length === 0) {
        return response(true, 'No se encontró caja registradora abierta', null)
      }
      return response(true, 'Caja registradora activa encontrada', Array.isArray(cashRegister) ? cashRegister[0] : cashRegister)
    })
    .catch((err) => {
      logger.error({ type: 'GET ACTIVE CASH REGISTER ERROR', message: `${err}`, data: err })
      return response(false, 'Error al traer la caja registradora activa', err)
    })
}