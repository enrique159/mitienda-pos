import type { Knex } from 'knex'
import knexFactory from 'knex'
import knexConfig from '../../database/knexfile.js'
import { response, logger, parseBoolean } from '../../helpers/index.js'
import * as productsRepository from '../products/productsRepository.js'

const knex = knexFactory(knexConfig)
const INVENTORIES_TABLE = 'iventories'

type InventoryStatus = 'draft' | 'pending' | 'started' | 'completed' | 'cancelled'

interface CreateInventoryPayload {
  id_company: string
  id_branch: string
  id_supervisor?: string | null
  id_seller_init?: string | null
  notes?: string | null
  status?: InventoryStatus
}

interface InventoryItemUpdate {
  id: string
  counted_quantity: number
  note?: string | null
}

function calculateIncidence(countedQuantity: number, registeredQuantity: number) {
  if (countedQuantity > registeredQuantity) return 'surplus'
  if (countedQuantity < registeredQuantity) return 'shortage'
  return 'none'
}

function normalizeProduct(product) {
  return {
    ...product,
    unlimited_stock: parseBoolean(product.unlimited_stock),
    is_active: parseBoolean(product.is_active),
  }
}

async function getInventoryItems(inventoryId: string) {
  const items = await knex('inventory_items')
    .select(
      'inventory_items.*',
      'products.name as product_name',
      'products.sku as product_sku',
      'products.barcode as product_barcode',
      'products.stock as current_stock',
      'products.unlimited_stock',
      'categories.name as category_name',
      'providers.name as provider_name'
    )
    .leftJoin('products', 'inventory_items.id_product', 'products.id')
    .leftJoin('categories', 'products.id_category', 'categories.id')
    .leftJoin('providers', 'products.id_provider', 'providers.id')
    .where('inventory_items.id_inventory', inventoryId)
    .orderBy('products.name', 'asc')

  return items.map((item) => ({
    ...item,
    unlimited_stock: parseBoolean(item.unlimited_stock),
  }))
}

async function buildInventoryResponse(inventory) {
  const items = await getInventoryItems(inventory.id)
  const countedItems = items.filter((item) => Number(item.counted_quantity) !== Number(item.registered_quantity)).length
  const totalDifference = items.reduce((acc, item) => {
    return acc + (Number(item.counted_quantity ?? 0) - Number(item.registered_quantity ?? 0))
  }, 0)

  return {
    ...inventory,
    items,
    items_count: items.length,
    counted_items: countedItems,
    total_difference: totalDifference,
  }
}

async function insertInventoryWithItems(inventory: CreateInventoryPayload, trx: Knex.Transaction) {
  const products = await trx('products')
    .select('id', 'stock', 'unlimited_stock', 'is_active')
    .where('id_company', inventory.id_company)
    .andWhere('is_active', true)
    .orderBy('name', 'asc')

  const stockProducts = products.map(normalizeProduct).filter((product) => !product.unlimited_stock)

  if (!stockProducts.length) {
    throw new Error('No hay productos con inventario controlado para crear el conteo')
  }

  const dataToInsert = {
    id_company: inventory.id_company,
    id_branch: inventory.id_branch,
    id_supervisor: inventory.id_supervisor ?? null,
    id_seller_init: inventory.id_seller_init ?? null,
    id_seller_end: null,
    date: new Date().toISOString().slice(0, 10),
    started_at: null,
    ended_at: null,
    status: inventory.status ?? 'pending',
    notes: inventory.notes ?? null,
    synced_at: null,
  }

  const inserted = await trx(INVENTORIES_TABLE).insert(dataToInsert).returning('id')
  const inventoryId = Array.isArray(inserted) ? inserted[0]?.id ?? inserted[0] : inserted

  const items = stockProducts.map((product) => {
    const registeredQuantity = Number(product.stock ?? 0)
    return {
      id_inventory: inventoryId,
      id_product: product.id,
      counted_quantity: registeredQuantity,
      registered_quantity: registeredQuantity,
      incidence: 'none',
      note: null,
      synced_at: null,
    }
  })

  await trx('inventory_items').insert(items)
  return { id: inventoryId, itemsCount: items.length }
}

export async function getInventories(status?: InventoryStatus | 'all') {
  try {
    const query = knex(INVENTORIES_TABLE)
      .select(
        `${INVENTORIES_TABLE}.*`,
        'branches.branch_name as branch_name',
        'seller_init.name as seller_init_name',
        'seller_end.name as seller_end_name',
        'supervisor.name as supervisor_name'
      )
      .leftJoin('branches', `${INVENTORIES_TABLE}.id_branch`, 'branches.id')
      .leftJoin('sellers as seller_init', `${INVENTORIES_TABLE}.id_seller_init`, 'seller_init.id')
      .leftJoin('sellers as seller_end', `${INVENTORIES_TABLE}.id_seller_end`, 'seller_end.id')
      .leftJoin('sellers as supervisor', `${INVENTORIES_TABLE}.id_supervisor`, 'supervisor.id')
      .orderBy(`${INVENTORIES_TABLE}.created_at`, 'desc')

    if (status && status !== 'all') {
      query.where(`${INVENTORIES_TABLE}.status`, status)
    }

    const inventories = await query
    const inventoriesWithStats = await Promise.all(inventories.map(buildInventoryResponse))
    return response(true, 'Inventarios encontrados', inventoriesWithStats)
  } catch (err) {
    console.log(err)
    logger.error({ type: 'GET INVENTORIES ERROR', message: `${err}`, data: err })
    return response(false, 'Error al traer los inventarios', err)
  }
}

export async function getInventoryById(id: string) {
  try {
    const inventory = await knex(INVENTORIES_TABLE)
      .select(
        `${INVENTORIES_TABLE}.*`,
        'branches.branch_name as branch_name',
        'seller_init.name as seller_init_name',
        'seller_end.name as seller_end_name',
        'supervisor.name as supervisor_name'
      )
      .leftJoin('branches', `${INVENTORIES_TABLE}.id_branch`, 'branches.id')
      .leftJoin('sellers as seller_init', `${INVENTORIES_TABLE}.id_seller_init`, 'seller_init.id')
      .leftJoin('sellers as seller_end', `${INVENTORIES_TABLE}.id_seller_end`, 'seller_end.id')
      .leftJoin('sellers as supervisor', `${INVENTORIES_TABLE}.id_supervisor`, 'supervisor.id')
      .where(`${INVENTORIES_TABLE}.id`, id)
      .first()

    if (!inventory) {
      return response(false, 'Inventario no encontrado', null)
    }

    return response(true, 'Inventario encontrado', await buildInventoryResponse(inventory))
  } catch (err) {
    console.log(err)
    logger.error({ type: 'GET INVENTORY BY ID ERROR', message: `${err}`, data: err })
    return response(false, 'Error al traer el inventario', err)
  }
}

export async function createInventory(inventory: CreateInventoryPayload, trx?: Knex.Transaction) {
  try {
    const result = trx
      ? await insertInventoryWithItems(inventory, trx)
      : await knex.transaction(async (transaction) => insertInventoryWithItems(inventory, transaction))

    logger.info({ type: 'CREATE INVENTORY', message: 'Inventario creado', data: { inventoryId: result.id, itemsCount: result.itemsCount } })
    return response(true, 'Inventario creado exitosamente', { id: result.id })
  } catch (err) {
    console.log(err)
    logger.error({ type: 'CREATE INVENTORY ERROR', message: `${err}`, data: err })
    return response(false, 'Error al crear el inventario', err)
  }
}

export async function startInventory(id: string, sellerId: string) {
  try {
    const updated = await knex(INVENTORIES_TABLE)
      .where('id', id)
      .whereIn('status', ['draft', 'pending'])
      .update({
        status: 'started',
        started_at: knex.fn.now(),
        id_seller_init: sellerId,
        updated_at: knex.fn.now(),
        synced_at: null,
      })

    if (!updated) return response(false, 'Inventario no encontrado o no se puede iniciar', null)
    return response(true, 'Inventario iniciado', { id })
  } catch (err) {
    console.log(err)
    logger.error({ type: 'START INVENTORY ERROR', message: `${err}`, data: err })
    return response(false, 'Error al iniciar el inventario', err)
  }
}

export async function updateInventoryItems(inventoryId: string, items: InventoryItemUpdate[]) {
  try {
    const inventory = await knex(INVENTORIES_TABLE).where('id', inventoryId).first()
    if (!inventory) return response(false, 'Inventario no encontrado', null)
    if (!['pending', 'started', 'draft'].includes(inventory.status)) {
      return response(false, 'Solo se pueden editar inventarios pendientes o en curso', null)
    }

    await knex.transaction(async (trx) => {
      for (const item of items) {
        const currentItem = await trx('inventory_items')
          .where('id', item.id)
          .where('id_inventory', inventoryId)
          .first()

        if (!currentItem) throw new Error('Producto de inventario no encontrado')

        const countedQuantity = Number(item.counted_quantity)
        if (!Number.isFinite(countedQuantity) || countedQuantity < 0) {
          throw new Error('Cantidad contada inválida')
        }

        await trx('inventory_items')
          .where('id', item.id)
          .update({
            counted_quantity: countedQuantity,
            incidence: calculateIncidence(countedQuantity, Number(currentItem.registered_quantity ?? 0)),
            note: item.note ?? null,
            updated_at: trx.fn.now(),
            synced_at: null,
          })
      }

      await trx(INVENTORIES_TABLE)
        .where('id', inventoryId)
        .update({
          updated_at: trx.fn.now(),
          synced_at: null,
        })
    })

    return response(true, 'Conteo actualizado', { id: inventoryId })
  } catch (err) {
    console.log(err)
    logger.error({ type: 'UPDATE INVENTORY ITEMS ERROR', message: `${err}`, data: err })
    return response(false, 'Error al actualizar el conteo', err)
  }
}

export async function approveInventory(id: string, sellerId: string) {
  try {
    await knex.transaction(async (trx) => {
      const inventory = await trx(INVENTORIES_TABLE).where('id', id).first()
      if (!inventory) throw new Error('Inventario no encontrado')
      if (!['pending', 'started', 'draft'].includes(inventory.status)) {
        throw new Error('Este inventario ya fue cerrado')
      }

      const items = await trx('inventory_items').where('id_inventory', id).select()
      if (!items.length) throw new Error('El inventario no tiene productos')

      for (const item of items) {
        const countedQuantity = Number(item.counted_quantity ?? 0)
        const registeredQuantity = Number(item.registered_quantity ?? 0)
        const difference = countedQuantity - registeredQuantity

        if (difference !== 0) {
          const stockResponse = await productsRepository.adjustStockProduct(item.id_product, difference, trx)
          if (!stockResponse.success) throw new Error(stockResponse.message)
        }
      }

      await trx(INVENTORIES_TABLE)
        .where('id', id)
        .update({
          status: 'completed',
          ended_at: trx.fn.now(),
          id_seller_end: sellerId,
          updated_at: trx.fn.now(),
          synced_at: null,
        })
    })

    return response(true, 'Inventario aprobado y stock reajustado', { id })
  } catch (err) {
    console.log(err)
    logger.error({ type: 'APPROVE INVENTORY ERROR', message: `${err}`, data: err })
    return response(false, 'Error al aprobar el inventario', err)
  }
}

export async function cancelInventory(id: string) {
  try {
    const updated = await knex(INVENTORIES_TABLE)
      .where('id', id)
      .whereNot('status', 'completed')
      .update({
        status: 'cancelled',
        updated_at: knex.fn.now(),
        synced_at: null,
      })

    if (!updated) return response(false, 'Inventario no encontrado o ya completado', null)
    return response(true, 'Inventario cancelado', { id })
  } catch (err) {
    console.log(err)
    logger.error({ type: 'CANCEL INVENTORY ERROR', message: `${err}`, data: err })
    return response(false, 'Error al cancelar el inventario', err)
  }
}
