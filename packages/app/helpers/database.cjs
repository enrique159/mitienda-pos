const knex = require('knex')(require('../database/knexfile.cjs'))
const logger = require('./logger.cjs')

const response = (success, message, response) => ({ success, message, response })

/**
 * Limpia todas las tablas de la base de datos
 * @param {Object} trx - Transacción de Knex (opcional)
 * @returns {Promise<{success: boolean, message: string, response: *}>}
 */
exports.cleanAllTables = async function (payload) {
  const transaction = payload.trx || await knex.transaction()

  try {
    // Desactivar restricciones de clave foránea temporalmente
    await transaction.raw('PRAGMA foreign_keys = OFF;')

    // Obtener todas las tablas de la base de datos
    const tables = await transaction.raw("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';")

    // Truncar cada tabla excepto las excluidas
    for (const tableObj of tables) {
      const tableName = tableObj.name
      if (!payload.excludedTables.includes(tableName)) {
        await transaction.raw(`DELETE FROM ${tableName};`)
      }
    }

    // Verificar si existe la tabla sqlite_sequence antes de intentar limpiarla
    const sequenceExists = await transaction.raw("SELECT name FROM sqlite_master WHERE type='table' AND name='sqlite_sequence';")

    if (sequenceExists && sequenceExists.length > 0) {
      // Reiniciar todas las secuencias de autoincremento de una vez
      await transaction.raw(`DELETE FROM sqlite_sequence;`)
    }

    // Reactivar restricciones de clave foránea
    await transaction.raw('PRAGMA foreign_keys = ON;')

    if (!payload.trx) {
      await transaction.commit()
    }

    return response(true, 'Todas las tablas han sido limpiadas correctamente', null)
  } catch (err) {
    if (!payload.trx) {
      await transaction.rollback()
    }
    logger.error({ type: 'CLEAN ALL TABLES ERROR', message: `${err}`, data: err })
    return response(false, 'Error al limpiar las tablas', err)
  }
}
