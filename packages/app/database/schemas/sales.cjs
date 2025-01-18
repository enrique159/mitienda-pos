const { logger } = require('../../helpers/index.cjs')

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.createTable = async function(knex) {
  await knex.schema.createTable('sales', (table) => {
    table.uuid('id').defaultTo(knex.fn.uuid()).primary()
    table.uuid('id_company').notNullable().references('company.id') // Relación con la empresa
    table.uuid('id_branch').notNullable().references('branches.id') // Relación con la sucursal
    table.uuid('id_seller').notNullable().references('sellers.id') // Relación con el vendedor
    table.uuid('id_customer').references('customers.id')
    table.string('folio').unique().notNullable() // Folio de la venta
    table.integer('total').defaultTo(0).notNullable() // Total de la venta (en centavos)
    table.integer('discount').defaultTo(0).notNullable() // Descuento aplicado (en centavos)
    table.boolean('on_trust').defaultTo(false) // La venta fue a crédito de la cuenta del cliente
    table.enu('payment_method', ['cash', 'card', 'transfer', 'other']).notNullable() // Método de pago
    table.integer('tax').defaultTo(0).notNullable() // Impuesto aplicado (en centavos)
    table.enu('status', ['pending', 'paid', 'rejected', 'deleted', 'refunded']).defaultTo('paid').notNullable() // Estado de la venta
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable() // Fecha de creación
    table.timestamp('updated_at').defaultTo(knex.fn.now()).notNullable() // Fecha de edición
    table.timestamp('synced_at')
  }).then(() => {
    console.log("Table 'sales' created.")
  }).catch((err) => {
    logger.error({ type: 'DB', error: err })
    console.error(err)
  })
}