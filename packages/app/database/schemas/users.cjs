const { logger } = require('../../helpers/index.cjs')

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.createTable = async function(knex) {
  await knex.schema.createTable('users', (table) => {
    table.uuid('id').defaultTo(knex.fn.uuid()).primary()
    table.string('name')
    table.string('email')
    table.string('password')
    table.enu('account_type', ['offline', 'business']).defaultTo('offline')
    table.enu('status', ['active', 'inactive']).defaultTo('active')
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable(); // Fecha de creación
    table.timestamp('updated_at').defaultTo(knex.fn.now()).notNullable(); // Fecha de edición
    table.timestamp('synced_at')
  }).then(() => {
    console.log("Table 'users' created.")
  }).catch((err) => {
    logger.error({ type: 'DB', error: err })
    console.error(err)
  })
}