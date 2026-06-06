import knexFactory from 'knex'
import knexConfig from '../../database/knexfile.js'
const knex = knexFactory(knexConfig)
import { response, logger, parseBoolean, parseArrayJson } from '../../helpers/index.js'

/**
 * Obtiene los inventarios
 * @returns { Promise<Response<Inventory[]>> }
 */
export async function getInventories() {
  return await knex('inventories')
    .select()
    .then((inventories) => {
      return response(true, 'Inventarios encontrados', inventories)
    })
    .catch((err) => {
      console.log(err)
      logger.error({
        type: 'GET INVENTORIES ERROR',
        message: `${err}`,
        data: err,
      })
      return response(false, 'Error al traer los inventarios', err)
    })
}

