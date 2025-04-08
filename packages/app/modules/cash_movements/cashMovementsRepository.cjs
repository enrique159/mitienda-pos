const knex = require('knex')(require('../../database/knexfile.cjs'))
const { response, logger } = require('../../helpers/index.cjs')

exports.createCashMovement = async function (data) {
  return await knex('cash_movements').insert(data).returning('*')
    .then((cashMovement) => {
      const cashMovementData = Array.isArray(cashMovement) ? cashMovement[0] : cashMovement
      return response(true, 'Movimiento de caja registradora creado', cashMovementData)
    })
    .catch((err) => {
      logger.error({ type: 'CREATE CASH MOVEMENT ERROR', message: `${err}`, data: err })
      return response(false, 'Error al crear el movimiento de caja registradora', err)
    })
}