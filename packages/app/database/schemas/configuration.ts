import { Knex } from 'knex'
import { logger } from '../../helpers/index.js'

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function createTable(knex: Knex) {
  await knex.schema.createTable('configuration', (table) => {
    table.uuid('id').defaultTo(knex.fn.uuid()).primary()
    table.boolean('configured').defaultTo(false)
    table.text('token', 'longtext').defaultTo(null)
    table.enu('mode', ['offline', 'business']).defaultTo('offline')
    table.string('default_printer').defaultTo(null)
    table.boolean('enable_sync').defaultTo(false)
    table.timestamp('last_sync')
  })
    .then(() => {
      console.log("Table 'configuration' created.")
    })
    .catch((err) => {
      logger.error({ type: 'DB', error: err })
      console.error(err)
    })
}

