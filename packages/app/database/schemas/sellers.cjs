const { logger } = require('../../helpers/index.cjs')

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.createTable = async function(knex) {
  await knex.schema.createTable('sellers', (table) => {
    table.uuid('id').defaultTo(knex.fn.uuid()).primary()
    table.uuid('id_company').references('company.id').notNullable()
    table.string('name')
    table.string('pin')
    table.bigInteger('permissions')
    table.enu('status', ['active', 'inactive']).defaultTo('active')
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable(); // Fecha de creación
    table.timestamp('updated_at').defaultTo(knex.fn.now()).notNullable(); // Fecha de edición
    table.timestamp('synced_at')
  }).then(() => {
    console.log("Table 'sellers' created.")
  }).catch((err) => {
    logger.error({ type: 'DB', error: err })
    console.error(err)
  })
}