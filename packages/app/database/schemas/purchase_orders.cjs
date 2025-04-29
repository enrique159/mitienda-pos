const { logger } = require('../../helpers/index.cjs')

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.createTable = async function(knex) {
  await knex.schema.createTable('purchase_orders', (table) => {
    table.uuid('id').defaultTo(knex.fn.uuid()).primary()
    table.uuid('id_company').notNullable().references('company.id')
    table.uuid('id_branch').notNullable().references('branches.id')
    table.uuid('id_provider').notNullable().references('providers.id')
    table.uuid('id_seller').notNullable().references('sellers.id')
    table.enu('status', ['draft', 'sent', 'received', 'cancelled']).defaultTo('draft')
    table.text('notes')
    table.timestamp('ordered_at')
    table.timestamp('received_at')
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable()
    table.timestamp('updated_at').defaultTo(knex.fn.now()).notNullable()
    table.timestamp('synced_at')
  }).then(() => {
    console.log("Table 'purchase_orders' created.")
  }).catch((err) => {
    logger.error({ type: 'DB', error: err })
    console.error(err)
  })
}
