const { logger } = require('../../helpers/index.cjs')

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.createTable = async function(knex) {
  await knex.schema.createTable('categories', (table) => {
    table.uuid('id').defaultTo(knex.fn.uuid()).primary()
    table.uuid('id_company').notNullable().references('company.id') // Relación con la empresa
    table.uuid('id_branch').notNullable().references('branches.id') // Relación con la sucursal
    table.string('name').notNullable() // Nombre de la categoría
    table.string('description') // Descripción breve
    table.enu('status', ['active', 'inactive']).defaultTo('active').notNullable() // Estado de la categoría
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable() // Fecha de creación
    table.timestamp('updated_at').defaultTo(knex.fn.now()).notNullable() // Fecha de edición
    table.timestamp('synced_at')
  }).then(() => {
    console.log("Table 'categories' created.")
  }).catch((err) => {
    logger.error({ type: 'DB', message: `${err}`, error: err })
    console.error(err)
  })
}