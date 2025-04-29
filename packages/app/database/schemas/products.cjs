const { logger } = require('../../helpers/index.cjs')

/**
 * TODO: Se requiere crear una tabla `purchase_orders` para los pedidos y una tabla `purchase_order_items` para los detalles de productos por pedido.
 *
 * - La tabla `purchase_orders` contendrá información general del pedido (empresa, proveedor, estatus, fechas, etc).
 * - La tabla `purchase_order_items` relacionará productos con pedidos, indicando cantidades solicitadas y recibidas, así como notas por diferencias o daños.
 * - Al recibir productos de un pedido, el campo `stock` de la tabla `products` debe incrementarse con la `quantity_received` registrada en `purchase_order_items`.
 *
 * No modificar el esquema de la tabla `products` aquí; el stock se debe actualizar mediante la lógica de recepción de pedidos.
 *
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.createTable = async function(knex) {
  await knex.schema.createTable('products', (table) => {
    table.uuid('id').defaultTo(knex.fn.uuid()).primary()
    table.uuid('id_company').notNullable().references('company.id') // Relación con la empresa
    table.uuid('id_category').notNullable().references('categories.id') // Relación con la categoría
    table.uuid('id_provider').notNullable().references('providers.id') // Relación con el proveedor
    table.string('name').notNullable() // Nombre del producto
    table.string('sku').unique().notNullable() // Código único (SKU)
    table.string('barcode') // Código de barras (opcional pero único)
    table.string('description') // Descripción breve
    table.enu('unit_measurement', ['piece', 'kg', 'g', 'liter', 'ml', 'box', 'other']).notNullable() // Unidad de medida
    table.boolean('is_bulk').defaultTo(false) // Si es a granel
    table.boolean('unlimited_stock').defaultTo(true) // Si el stock es ilimitado
    table.integer('stock').defaultTo(null) // Cantidad disponible
    table.integer('stock_minimum').defaultTo(null) // Nivel mínimo
    table.integer('purchase_price').defaultTo(null) // Precio de compra (en centavos)
    table.integer('selling_price').defaultTo(0).notNullable() // Precio de venta (en centavos)
    table.jsonb('taxes').defaultTo([]) // Impuestos aplicados: [{ code: '002', name: 'IVA', type: 'tasa', value: 16 }]
    table.boolean('is_active').defaultTo(true).notNullable() // Disponible para venta
    table.boolean('has_expiration_date').defaultTo(false).notNullable() // Si tiene fecha de caducidad
    table.date('expiration_date') // Fecha de caducidad
    table.boolean('requires_quantity').defaultTo(false) // Si requiere solicitar cantidad al momento de agregar a la venta
    table.boolean('is_composite').defaultTo(false).notNullable() // Si es un producto compuesto
    table.enu('status', ['active', 'inactive']).defaultTo('active').notNullable() // Estado del producto
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable() // Fecha de creación
    table.timestamp('updated_at').defaultTo(knex.fn.now()).notNullable() // Fecha de edición
    table.timestamp('synced_at')
  }).then(() => {
    console.log("Table 'products' created.")
  }).catch((err) => {
    logger.error({ type: 'DB', message: `${err}`, error: err })
    console.error(err)
  })
}