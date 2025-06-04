const knex = require('knex')(require('../../database/knexfile.cjs'))
const { response, logger } = require('../../helpers/index.cjs')

/*
  ** ******** OBTENER ÓRDENES DE COMPRA ********
*/
exports.getPurchaseOrders = async function () {
  try {
    const purchaseOrders = await knex('purchase_orders').select().orderBy('created_at', 'desc')
    if (!purchaseOrders.length) {
      logger.error({ type: 'GET PURCHASE ORDERS', message: 'No se encontraron órdenes de compra' })
      return response(true, 'Órdenes de compra no encontradas', [])
    }

    const purchaseOrdersWithItems = await Promise.all(purchaseOrders.map(async (order) => {
      const items = await knex('purchase_order_items').where('id_purchase_order', order.id).select()
      const provider = await knex('providers').where('id', order.id_provider).select().first()
      const seller = await knex('sellers').where('id', order.id_seller).select().first()

      return {
        ...order,
        items,
        provider_name: provider ? provider.name : 'Proveedor no encontrado',
        seller_name: seller ? seller.name : 'Vendedor no encontrado',
      }
    }))

    return response(true, 'Órdenes de compra encontradas', purchaseOrdersWithItems)
  } catch (err) {
    console.log(err)
    logger.error({ type: 'GET PURCHASE ORDERS ERROR', message: `${err}`, data: err })
    return response(false, 'Error al obtener las órdenes de compra', err)
  }
}

/*
  ** ******** CREAR UNA ORDEN DE COMPRA ********
*/
exports.createPurchaseOrder = async function (purchaseOrder, trx) {
  const dataToInsert = {
    ...purchaseOrder,
    ordered_at: purchaseOrder.status === 'sent' ? knex.fn.now() : null,
    synced_at: null,
  }
  const queryBuilder = trx ? knex('purchase_orders').transacting(trx) : knex('purchase_orders')
  return await queryBuilder.insert(dataToInsert).returning('id')
    .then((order) => {
      logger.info({ type: 'CREATE PURCHASE ORDER', message: 'Orden de compra creada', data: Array.isArray(order) ? order[0] : order })
      return response(true, 'Orden de compra creada', Array.isArray(order) ? order[0] : order)
    })
    .catch((err) => {
      console.log(err)
      logger.error({ type: 'CREATE PURCHASE ORDER ERROR', message: `${err}`, data: err })
      return response(false, 'Error al crear la orden de compra', err)
    })
}

exports.createPurchaseOrderItem = async function (purchaseOrderItem, trx) {
  const queryBuilder = trx ? knex('purchase_order_items').transacting(trx) : knex('purchase_order_items')
  return await queryBuilder.insert(purchaseOrderItem)
    .then((item) => {
      return response(true, 'Item de orden de compra creado', item)
    })
    .catch((err) => {
      console.log(err)
      logger.error({ type: 'CREATE PURCHASE ORDER ITEM ERROR', message: `${err}`, data: err })
      return response(false, 'Error al crear el item de la orden de compra', err)
    })
}

/*
  ** ******** ACTUALIZAR UNA ORDEN DE COMPRA ********
*/
exports.updatePurchaseOrder = async function (id, purchaseOrder) {
  const dataToUpdate = {
    ...purchaseOrder,
    updated_at: knex.fn.now(),
    synced_at: null,
  }
  try {
    const updated = await knex('purchase_orders').where('id', id).update(dataToUpdate)
    if (updated) {
      logger.info({ type: 'UPDATE PURCHASE ORDER', message: 'Orden de compra actualizada', data: { id, ...purchaseOrder } })
      return response(true, 'Orden de compra actualizada', { id, ...purchaseOrder })
    } else {
      logger.error({ type: 'UPDATE PURCHASE ORDER', message: 'Orden de compra no encontrada' })
      return response(false, 'Orden de compra no encontrada', null)
    }
  } catch (err) {
    console.log(err)
    logger.error({ type: 'UPDATE PURCHASE ORDER ERROR', message: `${err}`, data: err })
    return response(false, 'Error al actualizar la orden de compra', err)
  }
}

/*
  ** ******** ACTUALIZAR EL ESTADO DE COMPRA ********
*/
exports.updatePurchaseOrderStatus = async function (id, status) {
  const dataToUpdate = {
    status,
    updated_at: knex.fn.now(),
    synced_at: null,
    ...(status === 'sent' && { ordered_at: knex.fn.now() }),
    ...(status === 'received' && { received_at: knex.fn.now() }),
  }
  try {
    const updated = await knex('purchase_orders').where('id', id).update(dataToUpdate)
    if (updated) {
      logger.info({ type: 'UPDATE PURCHASE ORDER STATUS', message: 'Estado de orden de compra actualizado', data: { id, status } })
      return response(true, 'Estado de orden de compra actualizado', { id, status })
    } else {
      logger.error({ type: 'UPDATE PURCHASE ORDER STATUS', message: 'Orden de compra no encontrada' })
      return response(false, 'Orden de compra no encontrada', null)
    }
  } catch (err) {
    console.log(err)
    logger.error({ type: 'UPDATE PURCHASE ORDER STATUS ERROR', message: `${err}`, data: err })
    return response(false, 'Error al actualizar el estado de la orden de compra', err)
  }
}

/*
  ** ******** ACTUALIZAR UN ITEM DE ORDEN DE COMPRA ********
*/
exports.updatePurchaseOrderItem = async function (id, purchaseOrderItem) {
  const dataToUpdate = {
    ...purchaseOrderItem,
    updated_at: knex.fn.now(),
    synced_at: null,
  }
  try {
    const updated = await knex('purchase_order_items').where('id', id).update(dataToUpdate)
    if (updated) {
      logger.info({ type: 'UPDATE PURCHASE ORDER ITEM', message: 'Item de orden de compra actualizado', data: { id, ...purchaseOrderItem } })
      return response(true, 'Item de orden de compra actualizado', { id, ...purchaseOrderItem })
    } else {
      logger.error({ type: 'UPDATE PURCHASE ORDER ITEM', message: 'Item de orden de compra no encontrado' })
      return response(false, 'Item de orden de compra no encontrado', null)
    }
  } catch (err) {
    console.log(err)
    logger.error({ type: 'UPDATE PURCHASE ORDER ITEM ERROR', message: `${err}`, data: err })
    return response(false, 'Error al actualizar el item de la orden de compra', err)
  }
}
/*
  ** ******** ACTUALIZAR TODOS LOS ITEMS DE UNA ORDEN DE COMPRA ********
*/
exports.updatePurchaseOrderItems = async function (items) {
  try {
    // Use a transaction to ensure all updates succeed or fail together
    const result = await knex.transaction(async (trx) => {
      const updatePromises = items.map(async (item) => {
        const dataToUpdate = {
          quantity_received: item.quantity_received,
          incidence: item.incidence,
          note: item.note,
          updated_at: trx.fn.now(),
          synced_at: null,
        }

        // Update each item individually by its ID
        return await trx('purchase_order_items')
          .where('id', item.id)
          .update(dataToUpdate)
      })

      // Execute all updates in parallel
      return await Promise.all(updatePromises)
    })

    logger.info({
      type: 'UPDATE PURCHASE ORDER ITEMS',
      message: 'Items de orden de compra actualizados',
      data: { itemsCount: items.length },
    })
    return response(true, 'Items de orden de compra actualizados', items)
  } catch (err) {
    console.log(err)
    logger.error({
      type: 'UPDATE PURCHASE ORDER ITEMS ERROR',
      message: `${err}`,
      data: err,
    })
    return response(false, 'Error al actualizar los items de la orden de compra', err)
  }
}

/*
  ** ******** ELIMINAR UNA ORDEN DE COMPRA ********
*/
exports.deletePurchaseOrder = async function (id, trx) {
  const queryBuilder = trx ? knex('purchase_orders').transacting(trx) : knex('purchase_orders')
  return await queryBuilder.where('id', id).del()
    .then((deleted) => {
      if (deleted) {
        logger.info({ type: 'DELETE PURCHASE ORDER', message: 'Orden de compra eliminada', data: { id } })
        return response(true, 'Orden de compra eliminada', { id })
      } else {
        logger.error({ type: 'DELETE PURCHASE ORDER', message: 'Orden de compra no encontrada' })
        return response(false, 'Orden de compra no encontrada', null)
      }
    })
    .catch((err) => {
      console.log(err)
      logger.error({ type: 'DELETE PURCHASE ORDER ERROR', message: `${err}`, data: err })
      return response(false, 'Error al eliminar la orden de compra', err)
    })
}

/*
  ** ******** ELIMINAR TODOS LOS ITEMS DE UNA ORDEN DE COMPRA ********
*/
exports.deletePurchaseOrderItems = async function (purchaseOrderId, trx) {
  const queryBuilder = trx ? knex('purchase_order_items').transacting(trx) : knex('purchase_order_items')
  return await queryBuilder.where('id_purchase_order', purchaseOrderId).del()
    .then((deleted) => {
      logger.info({ type: 'DELETE PURCHASE ORDER ITEMS', message: 'Items de orden de compra eliminados', data: { purchaseOrderId } })
      return response(true, 'Items de orden de compra eliminados', { purchaseOrderId })
    })
    .catch((err) => {
      console.log(err)
      logger.error({ type: 'DELETE PURCHASE ORDER ITEMS ERROR', message: `${err}`, data: err })
      return response(false, 'Error al eliminar los items de la orden de compra', err)
    })
}
