const knex = require('knex')(require('../../database/knexfile.cjs'))
const { response, logger } = require('../../helpers/index.cjs')

const mapDataToUser = (data) => ({
  id: data.id,
  name: data.name,
  permissions: data.permissions,
  status: data.status,
  createdAt: data.created_at,
  updatedAt: data.updated_at,
})

const mapDataToUserSimple = (data) => ({
  id: data.id,
  name: data.name,
  pin: data.pin,
})

/**
 * Inicia una sesión de usuario
 * @param { { id: string, pin: string } } data
 */
exports.startSession = async function (data) {
  const user = await knex('users').select().where('id', data.id).first()
  if (!user) {
    logger.error({
      type: 'START SESSION',
      message: 'Usuario no encontrado',
      data,
    })
    return response(false, 'Usuario no encontrado', data)
  }
  if (user.pin !== data.pin) {
    logger.error({ type: 'START SESSION', message: 'PIN incorrecto', data })
    return response(false, 'PIN incorrecto', data)
  }
  logger.info({ type: 'START SESSION', user: { name: user.name }})
  return response(true, 'Usuario encontrado', mapDataToUser(user))
}

/**
 * Obtiene todos los usuarios activos
 */
exports.getUsers = async function () {
  const users = await knex('users').select().where('status', 'active')
  if (!users.length) {
    logger.error({ type: 'GET USERS', message: 'Usuarios no encontrados' })
    return response(false, 'Usuarios no encontrados', [])
  }
  return response(true, 'Usuarios encontrados', users.map(mapDataToUserSimple))
}