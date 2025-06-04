const { ipcMain } = require('electron')
const knex = require('knex')(require('../../database/knexfile.cjs'))
const purchaseOrdersRepository = require('./purchaseOrdersRepository.cjs')
const { response, logger } = require('../../helpers/index.cjs')

/*
  ** ******** OBTENER TODAS LAS ÓRDENES DE COMPRA ********
*/
ipcMain.on('get_purchase_orders', async (event) => {
  const response = await purchaseOrdersRepository.getPurchaseOrders()
  event.reply('get_purchase_orders', response)
})

/*
  ** ******** CREAR UNA ORDEN DE COMPRA CON SUS ITEMS ********
*/
ipcMain.on('create_purchase_order', async (event, payload) => {
  const { purchaseOrder, items } = payload
  let responseValue = null
  const trx = await knex.transaction()

  try {
    const response = await purchaseOrdersRepository.createPurchaseOrder(purchaseOrder, trx)
    responseValue = response
    if (response.success) {
      const purchaseOrderId = response.response.id
      for (const item of items) {
        item.id_purchase_order = purchaseOrderId
        await purchaseOrdersRepository.createPurchaseOrderItem(item, trx)
      }
      await trx.commit()
    }
  } catch (error) {
    await trx.rollback()
    logger.error({ type: 'CREATE PURCHASE ORDER ERROR', message: `${error}`, data: error })
    responseValue = response(false, 'Error al crear la orden de compra', null)
  }

  event.reply('create_purchase_order', responseValue)
})

/*
  ** ******** ACTUALIZAR UNA ORDEN DE COMPRA ********
*/
ipcMain.on('update_purchase_order', async (event, payload) => {
  const { id, purchaseOrder } = payload
  const response = await purchaseOrdersRepository.updatePurchaseOrder(id, purchaseOrder)
  event.reply('update_purchase_order', response)
})

/*
  ** ******** ACTUALIZAR EL ESTADO DE ORDEN DE COMPRA ********
*/
ipcMain.on('update_purchase_order_status', async (event, payload) => {
  const { id, status } = payload
  const response = await purchaseOrdersRepository.updatePurchaseOrderStatus(id, status)
  event.reply('update_purchase_order_status', response)
})

/*
  ** ******** ACTUALIZAR UN ITEM DE ORDEN DE COMPRA ********
*/
ipcMain.on('update_purchase_order_item', async (event, payload) => {
  const { id, purchaseOrderItem } = payload
  const response = await purchaseOrdersRepository.updatePurchaseOrderItem(id, purchaseOrderItem)
  event.reply('update_purchase_order_item', response)
})

/*
  ** ******** ACTUALIZAR TODOS LOS ITEMS DE UNA ORDEN DE COMPRA ********
*/
ipcMain.on('update_purchase_order_items', async (event, items) => {
  const response = await purchaseOrdersRepository.updatePurchaseOrderItems(items)
  event.reply('update_purchase_order_items', response)
})

/*
  ** ******** ELIMINAR UNA ORDEN DE COMPRA ********
*/
ipcMain.on('delete_purchase_order', async (event, id) => {
  let responseValue = null
  const trx = await knex.transaction()

  try {
    // First delete all items associated with the purchase order
    const itemsResponse = await purchaseOrdersRepository.deletePurchaseOrderItems(id, trx)
    if (itemsResponse.success) {
      // Then delete the purchase order itself
      const response = await purchaseOrdersRepository.deletePurchaseOrder(id, trx)
      responseValue = response
      if (response.success) {
        await trx.commit()
      } else {
        await trx.rollback()
      }
    } else {
      await trx.rollback()
      responseValue = response(false, 'Error al eliminar los items de la orden de compra', null)
    }
  } catch (error) {
    await trx.rollback()
    logger.error({ type: 'DELETE PURCHASE ORDER ERROR', message: `${error}`, data: error })
    responseValue = response(false, 'Error al eliminar la orden de compra', null)
  }

  event.reply('delete_purchase_order', responseValue)
})

/*
  ** ******** ACTUALIZAR ITEMS DE UNA ORDEN DE COMPRA EN DRAFT ********
*/
ipcMain.on('update_purchase_order_draft_items', async (event, params) => {
  const { purchaseOrderId, items } = params
  let responseValue = null
  const trx = await knex.transaction()

  try {
    // First delete all items associated with the purchase order
    const itemsResponse = await purchaseOrdersRepository.deletePurchaseOrderItems(purchaseOrderId, trx)
    if (itemsResponse.success) {
      // Then create the new items
      for (const item of items) {
        item.id_purchase_order = purchaseOrderId
        await purchaseOrdersRepository.createPurchaseOrderItem(item, trx)
      }
      await trx.commit()
      responseValue = response(true, 'Items de orden de compra actualizados', items)
    } else {
      await trx.rollback()
      responseValue = response(false, 'Error al eliminar los items de la orden de compra', null)
    }
  } catch (error) {
    await trx.rollback()
    logger.error({ type: 'DELETE PURCHASE ORDER ITEMS ERROR', message: `${error}`, data: error })
    responseValue = response(false, 'Error al eliminar los items de la orden de compra', null)
  }

  event.reply('update_purchase_order_draft_items', responseValue)
})
