const { logger } = require('../../helpers/index.cjs')

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.createTable = async function(knex) {
  await knex.schema.createTable('sale_details', (table) => {
    table.uuid('id').defaultTo(knex.fn.uuid()).primary()
    table.uuid('id_sale').notNullable().references('sales.id') // Relación con la venta
    table.uuid('id_product').notNullable().references('products.id') // Relación con el producto
    table.string('product_name').notNullable() // Nombre del producto
    table.integer('quantity').notNullable() // Cantidad vendida
    table.integer('selling_price').notNullable() // Precio de venta unitario (en centavos)
    table.integer('tax_amount').notNullable() // Tasa de impuesto aplicada a este producto (en centavos)
    // TODO: Guardar el impuesto aplicado
    table.jsonb('taxes').defaultTo([]) // Impuestos aplicados a este producto Ej: [{ code: '002', type: 'TASA', percent: 16, fixed: 0 }] (fixed en centavos)
    table.integer('discount').defaultTo(0) // Descuento aplicado a este producto (en centavos)
    table.integer('total').notNullable() // Total de la venta de este producto (en centavos)
    table.integer('profit').notNullable() // Ganancia neta de la venta de este producto (en centavos)
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable() // Fecha de creación
    table.timestamp('synced_at') // Fecha de sincronización con un servidor externo
  }).then(() => {
    console.log("Table 'sale_details' created.")
  }).catch((err) => {
    logger.error({ type: 'DB', error: err })
    console.error(err)
  })
}