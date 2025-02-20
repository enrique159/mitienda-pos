const knex = require('knex')(require('../../database/knexfile.cjs'))
const { response, logger, parseBoolean } = require('../../helpers/index.cjs')

function normalizeDiscount(discount) {
  let schedule = []
  try {
    schedule = discount.schedule? JSON.parse(discount.schedule) : []
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
exports.getActiveDiscounts = async function () {
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
exports.getDiscounts = async function () {
  return await knex('discounts').select()
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
 * Crear un descuento
 */
exports.createDiscount = async function (discount) {
  discount.schedule = discount.schedule.length ? JSON.stringify(discount.schedule) : []
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

/*
 * Asociar descuento a productos
*/
exports.createDiscountProduct = async function (discountId, productsId) {
  const trx = await knex.transaction()
  try {
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