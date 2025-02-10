const { logger } = require('../../helpers/index.cjs')

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.createTable = async function(knex) {
  await knex.schema.createTable('customers', (table) => {
    table.uuid('id').defaultTo(knex.fn.uuid()).primary()
    table.uuid('id_company').notNullable().references('company.id') // Relación con la empresa
    table.string('name').notNullable() // Nombre del cliente
    table.string('rfc').unique() // Registro Federal de Contribuyentes
    table.string('email').unique() // Correo electrónico
    table.string('phone') // Teléfono
    table.string('address') // Dirección
    table.boolean('has_credit').defaultTo(false) // Tiene crédito
    table.integer('credit_limit').defaultTo(0) // Límite de crédito
    table.integer('cutoff_day').defaultTo(1) // Día de corte
    table.integer('days_until_due').defaultTo(10) // Días hasta la vencimiento
    table.enu('status', ['active', 'inactive']).defaultTo('active').notNullable() // Estado del cliente
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable() // Fecha de creación
    table.timestamp('updated_at').defaultTo(knex.fn.now()).notNullable() // Fecha de edición
    table.timestamp('synced_at')
  }).then(() => {
    // eslint-disable-next-line no-console
    console.log("Table 'customers' created.")
  }).catch((err) => {
    logger.error({ type: 'DB', error: err })
    // eslint-disable-next-line no-console
    console.error(err)
  })
}