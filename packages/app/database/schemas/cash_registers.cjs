const { logger } = require('../../helpers/index.cjs')
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.createTable = async function(knex) {
  await knex.schema.createTable('cash_registers', (table) => {
    table.uuid('id').defaultTo(knex.fn.uuid()).primary()
    table.uuid('id_company').notNullable().references('company.id')
    table.uuid('id_branch').notNullable().references('branches.id')
    table.uuid('id_user_opening').notNullable().references('users.id')
    table.uuid('id_user_closing').references('users.id')
    table.integer('opening_amount').notNullable().defaultTo(0)
    table.timestamp('opening_date').defaultTo(knex.fn.now()).notNullable()
    table.timestamp('closing_date')
    table.timestamp('synced_opening_at')
    table.timestamp('synced_closing_at')
  }).then(() => {
    console.log("Table 'cash_registers' created.")
  }).catch((err) => {
    logger.error({ type: 'DB', error: err })
    console.error(err)
  })
}