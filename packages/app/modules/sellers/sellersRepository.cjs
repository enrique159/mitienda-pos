const knex = require('knex')(require('../../database/knexfile.cjs'))
const { response, logger, camelToSnakeCase } = require('../../helpers/index.cjs')
const sellersService = require('./sellersService.cjs')

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
exports.saveSellers = async function (sellers) {
  return await knex('sellers').insert(sellers).returning('*')
    .then((sellers) => {
      return response(true, 'Vendedores guardados', sellers.map(mapDataToSellerSimple))
    })
    .catch((err) => {
      logger.error({ type: 'SAVE SELLERS ERROR', message: `${err}`, data: err })
      return response(false, 'Error al guardar los vendedores', err)
    })
}

/**
 * Inicia una sesión de vendedor
 * @param { { id: string, pin: string } } data
 */
exports.startSession = async function (data) {
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
    logger.error({ type: 'START SESSION', message: 'PIN incorrecto', data: { seller_id: data.id } })
    return response(false, 'PIN incorrecto', data)
  }
  logger.info({ type: 'START SESSION', seller: { name: seller.name }})
  return response(true, 'Vendedor encontrado', mapDataToSeller(seller))
}

/**
 * Cierra una sesión de vendedor
 * @param { string } sellerId
 */
exports.closeSession = async function (sellerId) {
  try {
    const seller = await knex('sellers').select().where('id', sellerId).first()
    if (!seller) {
      logger.error({ type: 'CLOSE SESSION', message: 'Vendedor no encontrado', data: { seller_id: sellerId } })
      return response(false, 'Vendedor no encontrado', seller)
    }
    logger.info({ type: 'CLOSE SESSION', seller: { name: seller.name }})
    return response(true, 'Vendedor cerrado exitosamente', seller)
  } catch (error) {
    logger.error({ type: 'CLOSE SESSION', message: `${error}`, data: { seller_id: sellerId } })
    return response(false, 'Error al cerrar sesión', error)
  }
}

/**
 * Obtiene todos los vendedores activos
 * @returns { Response<SellerSimple[]> }
 */
exports.getSellers = async function () {
  const sellers = await knex('sellers').select().where('status', 'active')
  if (!sellers.length) {
    logger.error({ type: 'GET SELLERS', message: 'Vendedores no encontrados' })
    return response(false, 'Vendedores no encontrados', [])
  }
  return response(true, 'Vendedores encontrados', sellers.map(mapDataToSellerSimple))
}

/**
 * Obtiene un vendedor por su id
 * @param { string } sellerId
 */
exports.getSellerById = async function (sellerId) {
  const seller = await knex('sellers').select().where('id', sellerId).first()
  if (!seller) {
    logger.error({ type: 'GET SELLER BY ID', message: 'Vendedor no encontrado', data: { seller_id: sellerId } })
    return response(false, 'Vendedor no encontrado', seller)
  }
  return response(true, 'Vendedor encontrado', mapDataToSeller(seller))
}

/**
 * ☁️ Obtiene todos los vendedores activos de la base de datos de la nube
 * @returns { Response<Seller[]> }
 */
exports.getPosSellers = async function () {
  const responseFetch = await sellersService.fetchSellers()
  if (!responseFetch.success) {
    return responseFetch
  }
  try {
    const sellers = responseFetch.response.map(camelToSnakeCase)
    return await this.saveSellers(sellers)
  } catch (err) {
    logger.error({ type: 'GET POS SELLERS ERROR', message: `${err}`, data: err })
    return response(false, 'Error al obtener los vendedores', err)
  }
}