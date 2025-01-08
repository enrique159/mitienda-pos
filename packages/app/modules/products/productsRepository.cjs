const knex = require('knex')(require('../../database/knexfile.cjs'))
const { response, logger } = require('../../helpers/index.cjs')

/**
 * Obtiene todos los productos activos
 */
exports.getActiveProducts = async function () {
  return await knex('products').select().where('status', 'active')
    .then((products) => {
      if (!products.length) {
        logger.error({ type: 'GET PRODUCTS', message: 'No se encontraron productos' })
        return response(false, 'Productos no encontrados', [])
      }
      return response(true, 'Productos encontrados', products)
    })
    .catch((err) => {
      console.log(err)
      logger.error({ type: 'GET PRODUCTS ERROR', message: `${err}`, data: err })
      return response(false, 'Error al traer los productos', err)
    })
}

exports.getProductCategories = async function () {
  // return all the categories that are in the products rows in the category column grouped by category
  return await knex('products').select('category').groupBy('category')
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

exports.getProductsByCategory = async function (category) {
  return await knex('products').select().where('category', category)
    .then((products) => {
      if (!products.length) {
        logger.error({ type: 'GET PRODUCTS BY CATEGORY', message: 'No se encontraron productos' })
        return response(false, 'Productos no encontrados', [])
      }
      return response(true, 'Productos encontrados', products)
    })
    .catch((err) => {
      console.log(err)
      logger.error({ type: 'GET PRODUCTS BY CATEGORY ERROR', message: `${err}`, data: err })
      return response(false, 'Error al traer los productos', err)
    })
}
