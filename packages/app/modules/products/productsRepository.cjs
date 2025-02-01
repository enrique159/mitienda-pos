const knex = require('knex')(require('../../database/knexfile.cjs'))
const { response, logger, parseBoolean } = require('../../helpers/index.cjs')

function normalizeProduct(product) {
  let taxes = []
  try {
    taxes = product.taxes ? JSON.parse(product.taxes) : []
  } catch (err) {
    logger.error({ type: 'NORMALIZE PRODUCT', message: `${err}`, data: err })
    taxes = product.taxes
  }
  return {
    ...product,
    taxes: taxes,
    unlimited_stock: parseBoolean(product.unlimited_stock),
    is_bulk: parseBoolean(product.is_bulk),
    is_active: parseBoolean(product.is_active),
    is_available: parseBoolean(product.is_available),
    is_service: parseBoolean(product.is_service),
    is_taxable: parseBoolean(product.is_taxable),
    is_visible: parseBoolean(product.is_visible),
  }
}

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
      return response(true, 'Productos encontrados', products.map(normalizeProduct))
    })
    .catch((err) => {
      console.log(err)
      logger.error({ type: 'GET PRODUCTS ERROR', message: `${err}`, data: err })
      return response(false, 'Error al traer los productos', err)
    })
}

// DEPRECATED
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

exports.getProductsByCategory = async function (categoryId) {
  return await knex('products').select().where('id_category', categoryId)
    .then((products) => {
      if (!products.length) {
        logger.error({ type: 'GET PRODUCTS BY CATEGORY', message: 'No se encontraron productos' })
        return response(false, 'Productos no encontrados', [])
      }
      return response(true, 'Productos encontrados', products.map(normalizeProduct))
    })
    .catch((err) => {
      console.log(err)
      logger.error({ type: 'GET PRODUCTS BY CATEGORY ERROR', message: `${err}`, data: err })
      return response(false, 'Error al traer los productos', err)
    })
}
