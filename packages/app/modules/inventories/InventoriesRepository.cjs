const knex = require('knex')(require('../../database/knexfile.cjs'))
const {
  response,
  logger,
  parseBoolean,
  parseArrayJson,
} = require('../../helpers/index.cjs')

/**
 * Obtiene los inventarios
 * @returns { Promise<Response<Inventory[]>> }
 */
exports.getInventories = async function () {
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
