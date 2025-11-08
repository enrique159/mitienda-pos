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

/*
  ** ******** OBTENER MOVIMIENTOS DE CAJA ACTUAL ********
*/
exports.getMovementsInTurn = async function (cashRegisterId) {
  try {
    const cashMovements = await knex('cash_movements').where('id_cash_register', cashRegisterId).orderBy('created_at', 'desc')
    const sellers = await knex('sellers').select('*')
    
    const cashMovementsWithSellers = cashMovements.map((cashMovement) => {
      const seller = sellers.find((seller) => seller.id === cashMovement.id_seller)
      return {
        ...cashMovement,
        seller
      }
    })
    
    return response(true, 'Movimientos de caja registradora obtenidos', cashMovementsWithSellers)
  } catch (err) {
    logger.error({ type: 'GET CASH MOVEMENTS ERROR', message: `${err}`, data: err })
    return response(false, 'Error al obtener los movimientos de caja registradora', err)
  }    
}