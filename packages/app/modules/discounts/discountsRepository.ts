import knexFactory from 'knex'
import knexConfig from '../../database/knexfile.js'
const knex = knexFactory(knexConfig)
import { response, logger, parseBoolean, parseArrayJson } from '../../helpers/index.js'

function normalizeDiscount(discount) {
  let schedule = []
  try {
    schedule = parseArrayJson(discount.schedule)
  } catch (err) {
    logger.error({ type: 'NORMALIZE DISCOUNT', message: `${err}`, data: err })
    schedule = discount.schedule
  }
  return {
    ...discount,
    discount_for_one: parseBoolean(discount.discount_for_one),
    schedule: schedule,
  }
}

/**
 * Obtiene todos los descuentos activos
 */
export async function getActiveDiscounts() {
  return await knex('discounts').select().where('status', 'active')
    .then((discounts) => {
      if (!discounts.length) {
        logger.error({ type: 'GET DISCOUNTS', message: 'No se encontraron descuentos' })
        return response(false, 'Descuentos no encontrados', [])
      }
      return response(true, 'Descuentos encontrados', discounts.map(normalizeDiscount))
    })
    .catch((err) => {
      console.log(err)
      logger.error({ type: 'GET DISCOUNTS ERROR', message: `${err}`, data: err })
      return response(false, 'Error al traer los descuentos', err)
    })
}

/**
 * Obtiene todos los descuentos
 */
export async function getDiscounts() {
  return await knex('discounts').select()
    .then((discounts) => {
      return response(true, 'Descuentos encontrados', discounts.map(normalizeDiscount))
    })
    .catch((err) => {
      console.log(err)
      logger.error({ type: 'GET DISCOUNTS ERROR', message: `${err}`, data: err })
      return response(false, 'Error al traer los descuentos', err)
    })
}

/**
 * Crear un descuento
 */
export async function createDiscount(discount) {
  discount.schedule = discount?.schedule?.length > 0 ? JSON.stringify(discount.schedule) : null
  discount.start_date = discount.start_date.toISOString().slice(0, 10)
  if (discount.end_date) {
    discount.end_date = discount.end_date.toISOString().slice(0, 10)
  }
  return await knex('discounts').insert(discount).returning('*')
    .then((discount) => {
      if (!discount) {
        logger.error({ type: 'CREATE DISCOUNT', message: 'No se creo el descuento' })
        return response(false, 'Descuento no creado', null)
      }
      return response(true, 'Descuento creado', discount)
    })
    .catch((err) => {
      console.log(err)
      logger.error({ type: 'CREATE DISCOUNT ERROR', message: `${err}`, data: err })
      return response(false, 'Error al crear el descuento', err)
    })
}

/**
 * Actualizar un descuento
 */
export async function updateDiscount(discount) {
  discount.schedule = discount?.schedule?.length > 0 ? JSON.stringify(discount.schedule) : null
  discount.start_date = discount.start_date.toISOString().slice(0, 10)
  if (discount.end_date) {
    discount.end_date = discount.end_date.toISOString().slice(0, 10)
  }
  return await knex('discounts').where('id', discount.id).update(discount)
    .then((discount) => {
      return response(true, 'Descuento actualizado', discount)
    })
    .catch((err) => {
      console.log(err)
      logger.error({ type: 'UPDATE DISCOUNT ERROR', message: `${err}`, data: err })
      return response(false, 'Error al actualizar el descuento', err)
    })
}

/**
 * Eliminar un descuento
 */
export async function deleteDiscount(discountId) {
  return await knex('discounts').where('id', discountId).del()
    .then((discount) => {
      return response(true, 'Descuento eliminado', discount)
    })
    .catch((err) => {
      console.log(err)
      logger.error({ type: 'DELETE DISCOUNT ERROR', message: `${err}`, data: err })
      return response(false, 'Error al eliminar el descuento', err)
    })
}


/*
 * Obtiene todos los id de productos asociados a un descuento
*/
export async function getDiscountProducts(discountId) {
  return await knex('products_discounts').select('id_product').where('id_discount', discountId)
    .then((discounts) => {
      return response(true, 'Descuento encontrados', discounts)
    })
    .catch((err) => {
      console.log(err)
      logger.error({ type: 'GET DISCOUNT PRODUCTS ERROR', message: `${err}`, data: err })
      return response(false, 'Error al traer los descuentos', err)
    })
}

/*
 * Asociar descuento a productos
*/
export async function createDiscountProduct(discountId, productsId) {
  const trx = await knex.transaction()
  try {
    // First delete all existing associations for this discount
    await trx('products_discounts')
      .where('id_discount', discountId)
      .del()

    // Then insert new associations
    await trx('products_discounts').insert(
      productsId.map((productId) => ({
        id_product: productId,
        id_discount: discountId,
      }))
    )
    await trx.commit()
    return response(true, 'Descuento asociado a productos', null)
  } catch (err) {
    await trx.rollback()
    logger.error({ type: 'CREATE DISCOUNT PRODUCT ERROR', message: `${err}`, data: err })
    return response(false, 'Error al asociar el descuento a productos', err)
  }
}
