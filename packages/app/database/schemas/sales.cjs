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
    table.uuid('id_customer').references('customers.id') // Relación con el cliente (opcional)
    table.string('folio').unique().notNullable() // Folio de la venta
    table.integer('subtotal').defaultTo(0).notNullable() // Subtotal sin impuestos ni descuentos (en centavos)
    table.integer('total').defaultTo(0).notNullable() // Total de la venta (en centavos)
    table.integer('amount_paid').defaultTo(0).notNullable() // Cantidad pagada hasta el momento (en centavos)
    table.integer('balance_due').defaultTo(0).notNullable() // Cantidad pendiente de pago (en centavos)
    table.integer('discount').defaultTo(0).notNullable() // Descuento aplicado (en centavos)
    table.integer('tax').defaultTo(0).notNullable() // Impuesto aplicado (en centavos)
    table.boolean('on_trust').defaultTo(false) // La venta fue a crédito
    table.timestamp('due_date') // Fecha de vencimiento de la deuda (para ventas a crédito)
    table.enu('status', ['pending', 'partially_paid', 'paid', 'rejected', 'deleted', 'refunded']).defaultTo('pending').notNullable() // Estado de la venta
    table.string('customer_notes') // Notas del cliente
    table.string('cancellation_reason') // Razón de cancelación o rechazo
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable() // Fecha de creación
    table.timestamp('updated_at').defaultTo(knex.fn.now()).notNullable() // Fecha de edición
    table.timestamp('synced_at') // Fecha de sincronización con un servidor externo
  }).then(() => {
    console.log("Table 'sales' created.")
  }).catch((err) => {
    logger.error({ type: 'DB', error: err })
    console.error(err)
  })
}