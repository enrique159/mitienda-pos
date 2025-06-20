const knex = require('knex')(require('../../database/knexfile.cjs'))
const { response, logger } = require('../../helpers/index.cjs')

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
 * Obtiene todos los usuarios activos
 */
exports.getSellers = async function () {
  const sellers = await knex('sellers').select().where('status', 'active')
  if (!sellers.length) {
    logger.error({ type: 'GET SELLERS', message: 'Vendedores no encontrados' })
    return response(false, 'Vendedores no encontrados', [])
  }
  return response(true, 'Vendedores encontrados', sellers.map(mapDataToSellerSimple))
}