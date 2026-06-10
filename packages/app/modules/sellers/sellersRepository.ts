import knexFactory from 'knex'
import knexConfig from '../../database/knexfile.js'
const knex = knexFactory(knexConfig)
import { response, logger, camelToSnakeCase } from '../../helpers/index.js'
import * as sellersService from './sellersService.js'

const mapDataToSeller = (data) => ({
  id: data.id,
  id_company: data.id_company,
  name: data.name,
  permissions: data.permissions,
  status: data.status,
  created_at: data.created_at,
  updated_at: data.updated_at,
})

const mapDataToSellerSimple = (data) => ({
  id: data.id,
  name: data.name,
  pin: data.pin,
})

/**
 * Guarda los vendedores en la base de datos
 * @param { Seller[] } sellers
 */
export async function saveSellers(sellers) {
  return await knex('sellers')
    .insert(sellers)
    .returning('*')
    .then((sellers) => {
      return response(
        true,
        'Vendedores guardados',
        sellers.map(mapDataToSellerSimple)
      )
    })
    .catch((err) => {
      logger.error({ type: 'SAVE SELLERS ERROR', message: `${err}`, data: err })
      return response(false, 'Error al guardar los vendedores', err)
    })
}

/**
 * Guarda un vendedor en la base de datos
 * @param { Seller } seller
 */
export async function createSeller(seller) {
  return await knex('sellers')
    .insert(seller)
    .returning('*')
    .then((seller) => {
      logger.info({
        type: 'CREATE SELLER',
        message: 'Vendedor creado exitosamente',
        data: seller,
      })
      return response(true, 'Vendedor creado exitosamente', seller)
    })
    .catch((err) => {
      logger.error({
        type: 'CREATE SELLER ERROR',
        message: `${err}`,
        data: err,
      })
      return response(false, 'Error al crear el vendedor', err)
    })
}

/**
 * Actualiza un vendedor en la base de datos
 * @param { Seller } seller
 */
export async function updateSeller(seller) {
  return await knex('sellers')
    .update(seller)
    .where('id', seller.id)
    .returning('*')
    .then((seller) => {
      logger.info({
        type: 'UPDATE SELLER',
        message: 'Vendedor actualizado exitosamente',
        data: seller,
      })
      return response(true, 'Vendedor actualizado exitosamente', seller)
    })
    .catch((err) => {
      logger.error({
        type: 'UPDATE SELLER ERROR',
        message: `${err}`,
        data: err,
      })
      return response(false, 'Error al actualizar el vendedor', err)
    })
}

/**
 * Actualiza los permisos de un vendedor
 * @param { { id: string, permissions: string[] } } params
 */
export async function updatePermissionsSeller(params) {
  return await knex('sellers')
    .update({ permissions: params.permissions || 0 })
    .where('id', params.id)
    .returning('*')
    .then((seller) => {
      logger.info({
        type: 'UPDATE PERMISSIONS SELLER',
        message: 'Permisos actualizados exitosamente',
        data: seller,
      })
      return response(true, 'Permisos actualizados exitosamente', seller)
    })
    .catch((err) => {
      logger.error({
        type: 'UPDATE PERMISSIONS SELLER ERROR',
        message: `${err}`,
        data: err,
      })
      return response(false, 'Error al actualizar los permisos', err)
    })
}

/**
 * Elimina un vendedor de la base de datos
 * @param { string } sellerId
 */
export async function deleteSellerById(sellerId) {
  // Primero se revisa si hay algun otro vendedor activo, si no hay ninguno, no se puede eliminar
  const sellers = await knex('sellers').select().where('status', 'active')
  console.log('sellers', sellers)
  if (sellers.length < 2) {
    logger.error({
      type: 'DELETE SELLER BY ID',
      message:
        'No se puede eliminar el vendedor, debe haber al menos un vendedor activo',
      data: { seller_id: sellerId },
    })
    return response(
      false,
      'No se puede eliminar el vendedor, debe haber al menos un vendedor activo',
      sellerId
    )
  }
  return await knex('sellers')
    .update({ status: 'deleted' })
    .where('id', sellerId)
    .returning('*')
    .then((seller) => {
      logger.info({
        type: 'DELETE SELLER BY ID',
        message: 'Vendedor eliminado exitosamente',
        data: seller,
      })
      return response(true, 'Vendedor eliminado exitosamente', seller)
    })
    .catch((err) => {
      logger.error({
        type: 'DELETE SELLER BY ID ERROR',
        message: `${err}`,
        data: err,
      })
      return response(false, 'Error al eliminar el vendedor', err)
    })
}

/**
 * Inicia una sesión de vendedor
 * @param { { id: string, pin: string } } data
 */
export async function startSession(data) {
  const seller = await knex('sellers').select().where('id', data.id).first()
  if (!seller) {
    logger.error({
      type: 'START SESSION',
      message: 'Vendedor no encontrado',
      data: { seller_id: data.id },
    })
    return response(false, 'Vendedor no encontrado', data)
  }
  if (seller.pin !== data.pin) {
    logger.error({
      type: 'START SESSION',
      message: 'PIN incorrecto',
      data: { seller_id: data.id },
    })
    return response(false, 'PIN incorrecto', data)
  }
  logger.info({ type: 'START SESSION', seller: { name: seller.name } })
  return response(true, 'Vendedor encontrado', seller)
}

/**
 * Cierra una sesión de vendedor
 * @param { string } sellerId
 */
export async function closeSession(sellerId) {
  try {
    const seller = await knex('sellers').select().where('id', sellerId).first()
    if (!seller) {
      logger.error({
        type: 'CLOSE SESSION',
        message: 'Vendedor no encontrado',
        data: { seller_id: sellerId },
      })
      return response(false, 'Vendedor no encontrado', seller)
    }
    logger.info({ type: 'CLOSE SESSION', seller: { name: seller.name } })
    return response(true, 'Vendedor cerrado exitosamente', seller)
  } catch (error) {
    logger.error({
      type: 'CLOSE SESSION',
      message: `${error}`,
      data: { seller_id: sellerId },
    })
    return response(false, 'Error al cerrar sesión', error)
  }
}

/**
 * Obtiene todos los vendedores activos
 * @returns { Response<SellerSimple[]> }
 */
export async function getSellers() {
  const sellers = await knex('sellers').select().where('status', 'active')
  if (!sellers.length) {
    logger.error({ type: 'GET SELLERS', message: 'Vendedores no encontrados' })
    return response(false, 'Vendedores no encontrados', [])
  }
  return response(
    true,
    'Vendedores encontrados',
    sellers.map(mapDataToSellerSimple)
  )
}

/**
 * Obtiene todos los vendedores sin resctricción (todos)
 * @returns { Response<Seller[]> }
 */
export async function getAllSellers() {
  const sellers = await knex('sellers').select().whereNot('status', 'deleted')
  if (!sellers.length) {
    logger.error({
      type: 'GET ALL SELLERS',
      message: 'Vendedores no encontrados',
    })
    return response(false, 'Vendedores no encontrados', [])
  }
  return response(true, 'Vendedores encontrados', sellers)
}

/**
 * Obtiene un vendedor por su id
 * @param { string } sellerId
 */
export async function getSellerById(sellerId) {
  const seller = await knex('sellers').select().where('id', sellerId).first()
  if (!seller) {
    logger.error({
      type: 'GET SELLER BY ID',
      message: 'Vendedor no encontrado',
      data: { seller_id: sellerId },
    })
    return response(false, 'Vendedor no encontrado', seller)
  }
  return response(true, 'Vendedor encontrado', mapDataToSeller(seller))
}

/**
 * ☁️ Obtiene todos los vendedores activos de la base de datos de la nube
 * @returns { Response<Seller[]> }
 */
export async function getPosSellers() {
  const responseFetch = await sellersService.fetchSellers()
  if (!responseFetch.success) {
    return responseFetch
  }
  try {
    const sellers = responseFetch.response.map(camelToSnakeCase)
    return await saveSellers(sellers)
  } catch (err) {
    logger.error({
      type: 'GET POS SELLERS ERROR',
      message: `${err}`,
      data: err,
    })
    return response(false, 'Error al obtener los vendedores', err)
  }
}
