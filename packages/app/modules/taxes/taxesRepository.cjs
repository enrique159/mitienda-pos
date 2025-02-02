const knex = require('knex')(require('../../database/knexfile.cjs'))
const { response, logger } = require('../../helpers/index.cjs')

exports.getTaxes = async function () {
  try {
    const taxes = await knex('taxes').select().orderBy('code', 'asc')
    return response(true, 'Impuestos encontrados', taxes)
  } catch (error) {
    logger.error({ type: 'GET TAXES', message: error.message })
    return response(false, 'Error al obtener los impuestos', error)
  }
}

exports.createTax = async function (data) {
  try {
    const tax = await knex('taxes').insert(data)
    return response(true, 'Impuesto creado', tax)
  } catch (error) {
    logger.error({ type: 'CREATE TAX', message: error.message })
    return response(false, 'Error al crear el impuesto', error)
  }
}

exports.deleteTax = async function (id) {
  try {
    const tax = await knex('taxes').where('id', id).del()
    return response(true, 'Impuesto eliminado', tax)
  } catch (error) {
    logger.error({ type: 'DELETE TAX', message: error.message })
    return response(false, 'Error al eliminar el impuesto', error)
  }
}