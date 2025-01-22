const knex = require('knex')(require('../../database/knexfile.cjs'))
const { response, logger, parseBoolean } = require('../../helpers/index.cjs')

exports.getCustomers = async function () {
  return await knex('customers').select()
    .then((customers) => {
      return response(true, 'Clientes encontrados', customers)
    })
    .catch((err) => {
      logger.error({ type: 'GET CUSTOMERS ERROR', message: `${err}`, data: err })
      return response(false, 'Error al traer los clientes', err)
    })
}