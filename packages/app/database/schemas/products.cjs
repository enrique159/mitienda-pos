const { logger } = require('../../helpers/index.cjs')

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.createTable = async function(knex) {
  await knex.schema.createTable('products', (table) => {
    table.uuid('id').defaultTo(knex.fn.uuid()).primary()
    table.uuid('id_company').notNullable().references('company.id') // Relación con la empresa
    table.string('name').notNullable(); // Nombre del producto
    table.string('sku').unique().notNullable(); // Código único (SKU)
    table.string('barcode').unique(); // Código de barras
    table.string('description'); // Descripción breve
    table.string('category').notNullable(); // Categoría del producto
    table.enu('unit_measurement', ['piece', 'kg', 'g', 'liter', 'ml', 'box', 'other']).notNullable(); // Unidad de medida
    table.integer('stock').defaultTo(0).notNullable(); // Cantidad disponible
    table.integer('stock_minimum').defaultTo(0).notNullable(); // Nivel mínimo
    table.integer('purchase_price').defaultTo(0).notNullable(); // Precio de compra (en centavos)
    table.integer('selling_price').defaultTo(0).notNullable(); // Precio de venta (en centavos)
    table.integer('tax_rate').defaultTo(16).notNullable(); // Impuesto aplicado
    table.integer('discount_rate').defaultTo(0).notNullable(); // Descuento aplicado
    table.boolean('is_active').defaultTo(true).notNullable(); // Disponible para venta
    table.boolean('has_expiration_date').defaultTo(false).notNullable(); // Si tiene fecha de caducidad
    table.date('expiration_date'); // Fecha de caducidad
    table.boolean('is_composite').defaultTo(false).notNullable(); // Si es un producto compuesto
    table.enu('status', ['active', 'inactive']).defaultTo('active').notNullable(); // Estado del producto
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable(); // Fecha de creación
    table.timestamp('updated_at').defaultTo(knex.fn.now()).notNullable(); // Fecha de edición
    table.timestamp('synced_at')
  }).then(() => {
    console.log("Table 'sellers' created.")
  }).catch((err) => {
    logger.error({ type: 'DB', error: err })
    console.error(err)
  })
}