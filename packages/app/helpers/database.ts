import knexFactory from 'knex'
import knexConfig from '../database/knexfile'
import logger from './logger'

const knex = knexFactory(knexConfig)
const response = (success: boolean, message: string, response: any) => ({ success, message, response })

export async function cleanAllTables(payload: any) {
  const transaction = payload.trx || await knex.transaction()

  try {
    await transaction.raw('PRAGMA foreign_keys = OFF;')

    const tables = await transaction.raw("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';")

    for (const tableObj of tables) {
      const tableName = tableObj.name
      if (!payload.excludedTables.includes(tableName)) {
        await transaction.raw(`DELETE FROM ${tableName};`)
      }
    }

    const sequenceExists = await transaction.raw("SELECT name FROM sqlite_master WHERE type='table' AND name='sqlite_sequence';")

    if (sequenceExists && sequenceExists.length > 0) {
      await transaction.raw('DELETE FROM sqlite_sequence;')
    }

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
