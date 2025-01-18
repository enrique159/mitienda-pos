const { logger } = require('../../helpers/index.cjs')

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.createTable = async function (knex) {
  await knex.schema.createTable('configuration', (table) => {
    table.increments('id').primary()
    table.boolean('configured').defaultTo(false)
    table.enu('mode', ['offline', 'business']).defaultTo('offline')
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
