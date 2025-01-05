const { logger } = require('../../helpers/index.cjs')

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.createTable = async function(knex) {
  await knex.schema.createTable('branchs', (table) => {
    table.uuid('id').defaultTo(knex.fn.uuid()).primary()
    table.uuid('id_company').references('company.id').notNullable()
    table.string('branch_name').notNullable()
    table.string('branch_alias').notNullable()
    table.boolean('is_main').defaultTo(false).notNullable()
    table.boolean('pin_enabled').defaultTo(false).notNullable()
    table.string('pin')
    table.string('logo')
    table.jsonb('ticket_config').defaultTo({}).notNullable()
    table.dateTime('created_at').defaultTo(knex.fn.now()).notNullable()
    table.dateTime('updated_at').defaultTo(knex.fn.now()).notNullable()
    table.dateTime('synced_at')
  }).then(() => {
    console.log("Table 'branchs' created.")
  }).catch((err) => {
    logger.error({ type: 'DB', error: err })
    console.error(err)
  })
}