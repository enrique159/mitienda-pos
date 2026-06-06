// @ts-nocheck
const { logger } = require('../../helpers/index.cjs')

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.createTable = async function(knex) {
  await knex.schema.createTable('iventories', (table) => {
    table.uuid('id').defaultTo(knex.fn.uuid()).primary() // Llave primaria
    table.uuid('id_company').notNullable().references('companies.id') // A que compañia pertenece
    table.uuid('id_branch').notNullable().references('branches.id') // A que sucursal pertenece
    table.uuid('id_supervisor').nullable().references('sellers.id') // A que supervisor pertenece
    table.date('date').nullable() // Fecha del inventario
    table.date('started_at').nullable() // Fecha de inicio del inventario
    table.date('ended_at').nullable() // Fecha de fin del inventario
    table.uuid('id_seller_init').nullable().references('sellers.id') // Quien inicio el inventario
    table.uuid('id_seller_end').nullable().references('sellers.id') // Quien termino el inventario
    table.enum('status', ['draft', 'pending', 'started', 'completed', 'cancelled']).defaultTo('draft')
    table.text('notes').nullable() // Notas
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable()
    table.timestamp('updated_at').defaultTo(knex.fn.now()).notNullable()
    table.timestamp('synced_at')
  }).then(() => {
    console.log("Table 'iventories' created.")
  }).catch((err) => {
    logger.error({ type: 'DB', error: err })
    console.error(err)
  })
}

export {}
