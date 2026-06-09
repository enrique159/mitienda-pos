import knexFactory from 'knex'
import knexConfig from '../../database/knexfile.js'
const knex = knexFactory(knexConfig)
import { response, logger, parseBoolean, parseArrayJson } from '../../helpers/index.js'

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
 * Obtiene un producto por su id
 * @param {string} productId 
 * @returns 
 */
export async function getProductById(productId) {
  return await knex('products').where('id', productId).first()
    .then((product) => {
      if (!product) {
        logger.error({ type: 'GET PRODUCT BY ID', message: 'Producto no encontrado' })
        return response(false, 'Producto no encontrado', null)
      }
      return response(true, 'Producto encontrado', normalizeProduct(product))
    })
    .catch((err) => {
      console.log(err)
      logger.error({ type: 'GET PRODUCT BY ID ERROR', message: `${err}`, data: err })
      return response(false, 'Error al traer el producto', err)
    })
}

/**
 * Obtiene todos los productos para la sección de products
 */
export async function getProducts() {
  return await knex('products')
    .select('products.*', 'providers.name as provider', 'categories.name as category')
    .leftJoin('providers', 'products.id_provider', 'providers.id')
    .leftJoin('categories', 'products.id_category', 'categories.id')
    .groupBy('products.id')
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

/**
 * Obtiene todos los productos activos
 */
export async function getActiveProducts() {
  return await knex('products')
    .select('products.*', 'providers.name as provider', 'categories.name as category')
    .leftJoin('products_discounts', 'products.id', 'products_discounts.id_product')
    .leftJoin('discounts', 'products_discounts.id_discount', 'discounts.id')
    .leftJoin('providers', 'products.id_provider', 'providers.id')
    .leftJoin('categories', 'products.id_category', 'categories.id')
    .where('products.is_active', true)
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

export async function getProductsByCategory(categoryId) {
  return await knex('products')
    .select('products.*', 'providers.name as provider', 'categories.name as category')
    .leftJoin('products_discounts', 'products.id', 'products_discounts.id_product')
    .leftJoin('discounts', 'products_discounts.id_discount', 'discounts.id')
    .leftJoin('providers', 'products.id_provider', 'providers.id')
    .leftJoin('categories', 'products.id_category', 'categories.id')
    .where('products.id_category', categoryId)
    .andWhere('products.is_active', true)
    .groupBy('products.id')
    .then(async (products) => {
      if (!products.length) {
        logger.error({ type: 'GET PRODUCTS BY CATEGORY', message: 'No se encontraron productos' })
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
      logger.error({ type: 'GET PRODUCTS BY CATEGORY ERROR', message: `${err}`, data: err })
      return response(false, 'Error al traer los productos', err)
    })
}

export async function createProduct(product) {
  product.taxes = JSON.stringify(product.taxes || [])
  if (product.barcode) {
    const existingProduct = await knex('products').select().where('barcode', product.barcode)
    if (existingProduct.length) {
      logger.error({ type: 'CREATE PRODUCT ERROR', message: 'Ya existe un producto con el mismo código de barras' })
      return response(false, 'Ya existe un producto con el mismo código de barras')
    }
  }
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

export async function updateProduct(product) {
  product.taxes = JSON.stringify(product.taxes || [])
  return await knex('products').where('id', product.id).update(product)
    .then((product) => {
      logger.info({ type: 'UPDATE PRODUCT', message: 'Producto actualizado exitosamente', data: product })
      return response(true, 'Producto actualizado exitosamente', product)
    })
    .catch((err) => {
      console.log(err)
      logger.error({ type: 'UPDATE PRODUCT ERROR', message: `${err}`, data: err })
      return response(false, 'Error al actualizar el producto', err)
    })
}

export async function updateStockProduct(productId, stock, trx) {
  const queryBuilder = trx ? knex('products').transacting(trx) : knex('products')
  return await queryBuilder.where('id', productId).update({
    stock,
    updated_at: knex.fn.now(),
    synced_at: null,
  })
    .then((product) => {
      logger.info({ type: 'UPDATE STOCK PRODUCT', message: 'Stock actualizado exitosamente', data: product })
      return response(true, 'Stock actualizado exitosamente', product)
    })
    .catch((err) => {
      console.log(err)
      logger.error({ type: 'UPDATE STOCK PRODUCT ERROR', message: `${err}`, data: err })
      return response(false, 'Error al actualizar el stock', err)
    })
}

export async function adjustStockProduct(productId, quantityDelta, trx) {
  try {
    const delta = Number(quantityDelta)
    if (!Number.isFinite(delta)) {
      return response(false, 'Cantidad de stock inválida', null)
    }

    const queryBuilder = trx ? knex('products').transacting(trx) : knex('products')
    const product = await queryBuilder.where('id', productId).first()

    if (!product) {
      logger.error({ type: 'ADJUST STOCK PRODUCT', message: 'Producto no encontrado', data: { productId } })
      return response(false, 'Producto no encontrado', null)
    }

    const normalizedProduct = normalizeProduct(product)
    if (normalizedProduct.unlimited_stock) {
      return response(true, 'Producto con stock ilimitado', normalizedProduct)
    }

    const currentStock = Number(normalizedProduct.stock ?? 0)
    const newStock = Math.max(0, currentStock + delta)
    const updateResponse = await updateStockProduct(productId, newStock, trx)

    if (!updateResponse.success) {
      return updateResponse
    }

    return response(true, 'Stock ajustado exitosamente', {
      id: productId,
      previous_stock: currentStock,
      stock: newStock,
      delta,
    })
  } catch (err) {
    console.log(err)
    logger.error({ type: 'ADJUST STOCK PRODUCT ERROR', message: `${err}`, data: err })
    return response(false, 'Error al ajustar el stock', err)
  }
}

export async function deleteProduct(productId) {
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
