const { logger } = require('../../helpers/index.cjs')

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.createTable = async function(knex) {
  await knex.schema.createTable('discounts', (table) => {
    table.uuid('id').defaultTo(knex.fn.uuid()).primary()
    table.uuid('id_company').notNullable().references('company.id') // Relación con la empresa
    table.uuid('id_branch').notNullable().references('branches.id') // Relación con la sucursal
    table.string('description') // Descripción del descuento
    table.enu('type', ['percentage', 'amount']).notNullable().defaultTo('percentage') // Tipo de descuento (porcentaje o monto)
    table.float('value').notNullable() // Valor del descuento
    table.integer('condition_quantity').defaultTo(null) // Cantidad mínima del producto para aplicar el descuento
    table.boolean('discount_for_one').defaultTo(true) // Descuento solo para un producto
    table.date('start_date').notNullable() // Fecha de inicio del descuento
    table.date('end_date') // Fecha de finalización del descuento
    table.jsonb('schedule').defaultTo(null) // Horario de aplicación del descuento Ej: [{ day: 'monday', start_time: '08:00', end_time: '17:00' }]
    table.enu('status', ['active', 'inactive']).defaultTo('active').notNullable() // Estado del descuento
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable() // Fecha de creación
    table.timestamp('updated_at').defaultTo(knex.fn.now()).notNullable() // Fecha de edición
    table.timestamp('synced_at') // Fecha de sincronización con un servidor externo
  }).then(() => {
    console.log("Table 'discounts' created.")
  }).catch((err) => {
    logger.error({ type: 'DB', message: `${err}`, error: err })
    console.error(err)
  })
}