import knexFactory from 'knex'
import knexConfig from '../../database/knexfile.js'
const knex = knexFactory(knexConfig)
import { response, logger, parseBoolean } from '../../helpers/index.js'

const normalizeTax = function (tax) {
  return {
    ...tax,
    transferred: parseBoolean(tax.transferred),
    withheld: parseBoolean(tax.withheld),
  }
}

export async function getTaxes() {
  try {
    const taxes = await knex('taxes').select().orderBy('code', 'asc')
    return response(true, 'Impuestos encontrados', taxes.map(normalizeTax))
  } catch (error) {
    logger.error({ type: 'GET TAXES', message: error.message })
    return response(false, 'Error al obtener los impuestos', error)
  }
}

export async function createTax(data) {
  try {
    const tax = await knex('taxes').insert(data)
    return response(true, 'Impuesto creado', tax)
  } catch (error) {
    logger.error({ type: 'CREATE TAX', message: error.message })
    return response(false, 'Error al crear el impuesto', error)
  }
}

export async function deleteTax(id) {
  try {
    const tax = await knex('taxes').where('id', id).del()
    return response(true, 'Impuesto eliminado', tax)
  } catch (error) {
    logger.error({ type: 'DELETE TAX', message: error.message })
    return response(false, 'Error al eliminar el impuesto', error)
  }
}
