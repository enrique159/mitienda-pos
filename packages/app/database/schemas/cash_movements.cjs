const { logger } = require('../../helpers/index.cjs')
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.createTable = async function(knex) {
  await knex.schema.createTable('cash_movements', (table) => {
    table.uuid('id').defaultTo(knex.fn.uuid()).primary()
    table.uuid('id_cash_register').notNullable().references('cash_registers.id')
    table.integer('amount').notNullable()
    table.enum('type', ['income', 'withdraw']).notNullable()
    table.string('reason').notNullable()
    table.string('description')
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable()
    table.timestamp('synced_at')
  }).then(() => {
    console.log("Table 'cash_movements' created.")
  }).catch((err) => {
    logger.error({ type: 'DB', error: err })
    console.error(err)
  })
}