const knex = require('knex')(require('../../database/knexfile.cjs'))
const { response, logger, parseBoolean, parseArrayJson } = require('../../helpers/index.cjs')

function normalizeProduct(product) {
  let taxes = []
  try {
    taxes = parseArrayJson(product.taxes)
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
  return await knex('products')
    .select('products.*')
    .leftJoin('products_discounts', 'products.id', 'products_discounts.id_product')
    .leftJoin('discounts', 'products_discounts.id_discount', 'discounts.id')
    .where('products.status', 'active')
    .groupBy('products.id')
    .then(async (products) => {
      if (!products.length) {
        logger.error({ type: 'GET PRODUCTS', message: 'No se encontraron productos' })
        return response(false, 'Productos no encontrados', [])
      }

      // Get discounts for each product
      const productsWithDiscounts = await Promise.all(
        products.map(async (product) => {
          const discounts = await knex('discounts')
            .select('discounts.*')
            .join('products_discounts', 'discounts.id', 'products_discounts.id_discount')
            .where('products_discounts.id_product', product.id)
          return {
            ...normalizeProduct(product),
            discounts: discounts ? discounts.map((discount) => ({
              ...discount,
              schedule: parseArrayJson(discount.schedule),
            })) : [],
          }
        })
      )

      return response(true, 'Productos encontrados', productsWithDiscounts)
    })
    .catch((err) => {
      console.log(err)
      logger.error({ type: 'GET PRODUCTS ERROR', message: `${err}`, data: err })
      return response(false, 'Error al traer los productos', err)
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

exports.createProduct = async function (product) {
  product.taxes = JSON.stringify(product.taxes || [])
  return await knex('products').insert(product).returning('*')
    .then((product) => {
      logger.info({ type: 'CREATE PRODUCT', message: 'Producto creado exitosamente', data: product })
      return response(true, 'Producto creado exitosamente', product)
    })
    .catch((err) => {
      console.log(err)
      logger.error({ type: 'CREATE PRODUCT ERROR', message: `${err}`, data: err })
      return response(false, 'Error al crear el producto', err)
    })
}

exports.deleteProduct = async function (productId) {
  return await knex('products').where('id', productId).del()
    .then((product) => {
      logger.info({ type: 'DELETE PRODUCT', message: 'Producto eliminado exitosamente', data: product })
      return response(true, 'Producto eliminado exitosamente', product)
    })
    .catch((err) => {
      console.log(err)
      logger.error({ type: 'DELETE PRODUCT ERROR', message: `${err}`, data: err })
      return response(false, 'Error al eliminar el producto', err)
    })
}