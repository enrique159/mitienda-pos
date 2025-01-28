const knex = require('knex')(require('../../database/knexfile.cjs'))
const { response, logger, parseBoolean } = require('../../helpers/index.cjs')

exports.getCategories = async function () {
  return await knex('categories').select()
    .then((categories) => {
      if (!categories.length) {
        logger.error({ type: 'GET CATEGORIES', message: 'No se encontraron categorias' })
        return response(false, 'Categorias no encontradas', [])
      }
      return response(true, 'Categorias encontradas', categories)
    })
    .catch((err) => {
      console.log(err)
      logger.error({ type: 'GET CATEGORIES ERROR', message: `${err}`, data: err })
      return response(false, 'Error al traer las categorias', err)
    })
}