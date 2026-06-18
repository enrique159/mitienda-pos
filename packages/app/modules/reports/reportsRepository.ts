import knexFactory from 'knex'
import knexConfig from '../../database/knexfile.js'
import { logger, parseBoolean, response } from '../../helpers/index.js'

const knex = knexFactory(knexConfig)

type ReportFilters = {
  startDate?: string
  endDate?: string
  id_branch?: string
  id_seller?: string
  id_customer?: string
  payment_method?: string
  id_category?: string
  id_product?: string
  search?: string
}

const cancelledStatuses = ['rejected', 'deleted', 'refunded']

const emptyMoney = {
  totalSales: 0,
  estimatedProfit: 0,
  averageTicket: 0,
  salesCount: 0,
  cancelledSales: 0,
  creditSales: 0,
  cashInRegister: 0,
  cashDifference: 0,
}

const normalizeDateRange = (filters: ReportFilters) => ({
  start: filters.startDate ? `${filters.startDate} 00:00:00` : null,
  end: filters.endDate ? `${filters.endDate} 23:59:59` : null,
})

const roundMoney = (value: number) => Math.round(value || 0)

const hasTableColumn = async (table: string, column: string) => {
  const columns = await knex(table).columnInfo()
  return Boolean(columns[column])
}

const byDateKey = (date: string | Date) => {
  const value = `${date}`
  return value.includes('T') ? value.split('T')[0] : value.split(' ')[0]
}

const applySaleFilters = async (filters: ReportFilters) => {
  const query = knex('sales')
    .leftJoin('sellers', 'sales.id_seller', 'sellers.id')
    .leftJoin('customers', 'sales.id_customer', 'customers.id')
    .leftJoin('branches', 'sales.id_branch', 'branches.id')
    .select(
      'sales.*',
      'sellers.name as seller_name',
      'customers.name as customer_name',
      'branches.branch_alias as branch_name',
    )
    .orderBy('sales.created_at', 'desc')

  const { start, end } = normalizeDateRange(filters)
  if (start) query.where('sales.created_at', '>=', start)
  if (end) query.where('sales.created_at', '<=', end)
  if (filters.id_branch) query.where('sales.id_branch', filters.id_branch)
  if (filters.id_seller) query.where('sales.id_seller', filters.id_seller)
  if (filters.id_customer) query.where('sales.id_customer', filters.id_customer)

  if (filters.payment_method) {
    query.whereIn('sales.id', knex('sale_payments')
      .select('id_sale')
      .where('payment_method', filters.payment_method))
  }

  if (filters.id_product || filters.id_category) {
    const detailQuery = knex('sale_details')
      .leftJoin('products', 'sale_details.id_product', 'products.id')
      .select('sale_details.id_sale')

    if (filters.id_product) detailQuery.where('sale_details.id_product', filters.id_product)
    if (filters.id_category) detailQuery.where('products.id_category', filters.id_category)

    query.whereIn('sales.id', detailQuery)
  }

  if (filters.search) {
    const search = `%${filters.search}%`
    query.andWhere((builder) => {
      builder
        .where('sales.folio', 'like', search)
        .orWhere('customers.name', 'like', search)
        .orWhere('sellers.name', 'like', search)
    })
  }

  return query
}

const getSaleDetails = async (saleIds: string[], filters: ReportFilters) => {
  if (!saleIds.length) return []

  const query = knex('sale_details')
    .leftJoin('products', 'sale_details.id_product', 'products.id')
    .leftJoin('categories', 'products.id_category', 'categories.id')
    .leftJoin('providers', 'products.id_provider', 'providers.id')
    .whereIn('sale_details.id_sale', saleIds)
    .select(
      'sale_details.*',
      'products.sku as product_sku',
      'products.stock as product_stock',
      'products.stock_minimum as product_stock_minimum',
      'products.purchase_price as product_purchase_price',
      'categories.id as id_category',
      'categories.name as category_name',
      'providers.id as id_provider',
      'providers.name as provider_name',
    )

  if (filters.id_product) query.where('sale_details.id_product', filters.id_product)
  if (filters.id_category) query.where('products.id_category', filters.id_category)

  return query
}

const getSalePayments = async (saleIds: string[], filters: ReportFilters) => {
  if (!saleIds.length) return []

  const query = knex('sale_payments')
    .whereIn('id_sale', saleIds)
    .select()

  if (filters.payment_method) query.where('payment_method', filters.payment_method)

  return query
}

const getCashMovements = async (filters: ReportFilters) => {
  const hasSeller = await hasTableColumn('cash_movements', 'id_seller')
  const query = knex('cash_movements')
    .leftJoin('cash_registers', 'cash_movements.id_cash_register', 'cash_registers.id')
    .orderBy('cash_movements.created_at', 'desc')

  if (hasSeller) {
    query
      .leftJoin('sellers', 'cash_movements.id_seller', 'sellers.id')
      .select('cash_movements.*', 'sellers.name as seller_name')
  } else {
    query.select('cash_movements.*', knex.raw('NULL as seller_name'))
  }

  const { start, end } = normalizeDateRange(filters)
  if (start) query.where('cash_movements.created_at', '>=', start)
  if (end) query.where('cash_movements.created_at', '<=', end)
  if (filters.id_branch) query.where('cash_registers.id_branch', filters.id_branch)
  if (filters.id_seller && hasSeller) query.where('cash_movements.id_seller', filters.id_seller)

  return query
}

const getCashAudits = async (filters: ReportFilters) => {
  const query = knex('cash_register_audits')
    .leftJoin('cash_registers', 'cash_register_audits.id_cash_register', 'cash_registers.id')
    .select('cash_register_audits.*', 'cash_registers.opening_date')
    .orderBy('cash_register_audits.created_at', 'desc')

  const { start, end } = normalizeDateRange(filters)
  if (start) query.where('cash_register_audits.created_at', '>=', start)
  if (end) query.where('cash_register_audits.created_at', '<=', end)
  if (filters.id_branch) query.where('cash_registers.id_branch', filters.id_branch)

  return query
}

const getCashRegistersByIds = async (cashRegisterIds: string[], filters: ReportFilters) => {
  if (!cashRegisterIds.length) return []

  const query = knex('cash_registers')
    .leftJoin('sellers as opening_sellers', 'cash_registers.id_user_opening', 'opening_sellers.id')
    .whereIn('cash_registers.id', cashRegisterIds)
    .select('cash_registers.*', 'opening_sellers.name as seller_name')

  if (filters.id_branch) query.where('cash_registers.id_branch', filters.id_branch)
  if (filters.id_seller) {
    query.andWhere((builder) => {
      builder
        .where('cash_registers.id_user_opening', filters.id_seller)
        .orWhere('cash_registers.id_user_closing', filters.id_seller)
    })
  }

  return query
}

const getPurchases = async (filters: ReportFilters) => {
  const query = knex('purchase_orders')
    .leftJoin('providers', 'purchase_orders.id_provider', 'providers.id')
    .leftJoin('sellers', 'purchase_orders.id_seller', 'sellers.id')
    .leftJoin('purchase_order_items', 'purchase_orders.id', 'purchase_order_items.id_purchase_order')
    .leftJoin('products', 'purchase_order_items.id_product', 'products.id')
    .select(
      'purchase_orders.id',
      'purchase_orders.status',
      'purchase_orders.ordered_at',
      'purchase_orders.received_at',
      'purchase_orders.created_at',
      'providers.name as provider_name',
      'sellers.name as seller_name',
    )
    .sum({ ordered_quantity: 'purchase_order_items.quantity_ordered' })
    .sum({ received_quantity: 'purchase_order_items.quantity_received' })
    .groupBy('purchase_orders.id')
    .orderBy('purchase_orders.created_at', 'desc')

  const { start, end } = normalizeDateRange(filters)
  if (start) query.where('purchase_orders.created_at', '>=', start)
  if (end) query.where('purchase_orders.created_at', '<=', end)
  if (filters.id_branch) query.where('purchase_orders.id_branch', filters.id_branch)
  if (filters.id_seller) query.where('purchase_orders.id_seller', filters.id_seller)
  if (filters.id_product) query.where('purchase_order_items.id_product', filters.id_product)

  return query
}

const getInventoryAudits = async (filters: ReportFilters) => {
  const query = knex('iventories')
    .leftJoin('sellers as supervisor', 'iventories.id_supervisor', 'supervisor.id')
    .leftJoin('inventory_items', 'iventories.id', 'inventory_items.id_inventory')
    .leftJoin('products', 'inventory_items.id_product', 'products.id')
    .select(
      'iventories.id',
      'iventories.status',
      'iventories.date',
      'iventories.started_at',
      'iventories.ended_at',
      'iventories.created_at',
      'supervisor.name as supervisor_name',
    )
    .count({ items_count: 'inventory_items.id' })
    .sum({ counted_quantity: 'inventory_items.counted_quantity' })
    .sum({ registered_quantity: 'inventory_items.registered_quantity' })
    .groupBy('iventories.id')
    .orderBy('iventories.created_at', 'desc')

  const { start, end } = normalizeDateRange(filters)
  if (start) query.where('iventories.created_at', '>=', start)
  if (end) query.where('iventories.created_at', '<=', end)
  if (filters.id_branch) query.where('iventories.id_branch', filters.id_branch)
  if (filters.id_product) query.where('inventory_items.id_product', filters.id_product)

  return query
}

const getCatalogs = async () => {
  const [branches, sellers, customers, categories, products, providers] = await Promise.all([
    knex('branches').select('id', 'branch_alias as name').orderBy('branch_alias', 'asc'),
    knex('sellers').select('id', 'name').whereNot('status', 'deleted').orderBy('name', 'asc'),
    knex('customers').select('id', 'name').where('status', 'active').orderBy('name', 'asc'),
    knex('categories').select('id', 'name').where('status', 'active').orderBy('name', 'asc'),
    knex('products').select('id', 'name', 'id_category').where('status', 'active').orderBy('name', 'asc'),
    knex('providers').select('id', 'name').where('status', 'active').orderBy('name', 'asc'),
  ])

  return { branches, sellers, customers, categories, products, providers }
}

const aggregateReport = async (filters: ReportFilters) => {
  const sales = (await applySaleFilters(filters)).map((sale) => ({
    ...sale,
    on_trust: parseBoolean(sale.on_trust),
    is_ticket_printed: parseBoolean(sale.is_ticket_printed),
  }))
  const saleIds = sales.map((sale) => sale.id)
  const [details, payments, movements, audits, purchases, inventoryAudits, catalogs] = await Promise.all([
    getSaleDetails(saleIds, filters),
    getSalePayments(saleIds, filters),
    getCashMovements(filters),
    getCashAudits(filters),
    getPurchases(filters),
    getInventoryAudits(filters),
    getCatalogs(),
  ])

  const validSales = sales.filter((sale) => !cancelledStatuses.includes(sale.status))
  const validSaleIds = new Set(validSales.map((sale) => sale.id))
  const validSalesById = new Map(validSales.map((sale) => [sale.id, sale]))
  const validDetails = details.filter((detail) => validSaleIds.has(detail.id_sale))
  const validPayments = payments.filter((payment) => validSaleIds.has(payment.id_sale))
  const cashRegisterIds = Array.from(new Set([
    ...validSales.map((sale) => sale.id_cash_register),
    ...movements.map((movement) => movement.id_cash_register),
    ...audits.map((audit) => audit.id_cash_register),
  ].filter(Boolean)))
  const cashRegisters = await getCashRegistersByIds(cashRegisterIds, filters)

  const summary = {
    ...emptyMoney,
    totalSales: roundMoney(validSales.reduce((total, sale) => total + (sale.total || 0), 0)),
    estimatedProfit: roundMoney(validDetails.reduce((total, detail) => total + (detail.profit || 0), 0)),
    salesCount: validSales.length,
    cancelledSales: sales.filter((sale) => cancelledStatuses.includes(sale.status)).length,
    creditSales: validSales.filter((sale) => sale.on_trust || sale.balance_due > 0).length,
    cashDifference: roundMoney(audits.reduce((total, audit) => total + (audit.difference || 0), 0)),
  }

  summary.averageTicket = summary.salesCount ? roundMoney(summary.totalSales / summary.salesCount) : 0
  summary.cashInRegister = roundMoney(
    cashRegisters.reduce((total, cashRegister) => total + (cashRegister.opening_amount || 0), 0)
    + validPayments.filter((payment) => payment.payment_method === 'cash').reduce((total, payment) => total + (payment.amount || 0), 0)
    + movements.filter((movement) => movement.type === 'income').reduce((total, movement) => total + (movement.amount || 0), 0)
    - movements.filter((movement) => movement.type === 'withdraw').reduce((total, movement) => total + (movement.amount || 0), 0),
  )

  const salesByDayMap = new Map<string, { date: string, total: number, count: number }>()
  validSales.forEach((sale) => {
    const date = byDateKey(sale.created_at)
    const current = salesByDayMap.get(date) || { date, total: 0, count: 0 }
    current.total += sale.total || 0
    current.count += 1
    salesByDayMap.set(date, current)
  })

  const paymentMethods = ['cash', 'card', 'transfer', 'credit', 'other'].map((method) => ({
    method,
    total: roundMoney(validPayments
      .filter((payment) => payment.payment_method === method)
      .reduce((total, payment) => total + (payment.amount || 0), 0)),
  }))

  const productsMap = new Map<string, any>()
  validDetails.forEach((detail) => {
    const current = productsMap.get(detail.id_product) || {
      id_product: detail.id_product,
      product_name: detail.product_name,
      category_name: detail.category_name || 'Sin categoria',
      provider_name: detail.provider_name || 'Sin proveedor',
      quantity: 0,
      total: 0,
      profit: 0,
    }
    current.quantity += detail.quantity || 0
    current.total += detail.total || 0
    current.profit += detail.profit || 0
    productsMap.set(detail.id_product, current)
  })

  const categoriesMap = new Map<string, any>()
  validDetails.forEach((detail) => {
    const key = detail.id_category || 'unknown'
    const current = categoriesMap.get(key) || {
      id_category: detail.id_category,
      category_name: detail.category_name || 'Sin categoria',
      quantity: 0,
      total: 0,
      profit: 0,
    }
    current.quantity += detail.quantity || 0
    current.total += detail.total || 0
    current.profit += detail.profit || 0
    categoriesMap.set(key, current)
  })

  const credits = validSales
    .filter((sale) => sale.on_trust || sale.balance_due > 0)
    .map((sale) => ({
      id: sale.id,
      folio: sale.folio,
      customer_name: sale.customer_name || 'Cliente no asignado',
      seller_name: sale.seller_name || 'Sin vendedor',
      total: sale.total || 0,
      amount_paid: sale.amount_paid || 0,
      balance_due: sale.balance_due || 0,
      due_date: sale.due_date,
      status: sale.status,
      created_at: sale.created_at,
    }))

  const inventory = await knex('products')
    .leftJoin('categories', 'products.id_category', 'categories.id')
    .leftJoin('providers', 'products.id_provider', 'providers.id')
    .modify((query) => {
      if (filters.id_category) query.where('products.id_category', filters.id_category)
      if (filters.id_product) query.where('products.id', filters.id_product)
    })
    .select(
      'products.id',
      'products.name',
      'products.sku',
      'products.stock',
      'products.stock_minimum',
      'products.unlimited_stock',
      'products.selling_price',
      'products.purchase_price',
      'categories.name as category_name',
      'providers.name as provider_name',
    )
    .orderBy('products.name', 'asc')

  return {
    summary,
    charts: {
      salesByDay: Array.from(salesByDayMap.values()).sort((a, b) => a.date.localeCompare(b.date)),
      paymentMethods,
      topProducts: Array.from(productsMap.values()).sort((a, b) => b.quantity - a.quantity).slice(0, 10),
      salesByCategory: Array.from(categoriesMap.values()).sort((a, b) => b.total - a.total),
    },
    tables: {
      sales: sales.map((sale) => ({
        id: sale.id,
        folio: sale.folio,
        customer_name: sale.customer_name || 'Publico general',
        seller_name: sale.seller_name || 'Sin vendedor',
        branch_name: sale.branch_name || 'Sucursal',
        total: sale.total || 0,
        amount_paid: sale.amount_paid || 0,
        balance_due: sale.balance_due || 0,
        status: sale.status,
        on_trust: sale.on_trust,
        created_at: sale.created_at,
      })),
      products: Array.from(productsMap.values()).sort((a, b) => b.total - a.total),
      cash: [
        ...cashRegisters.map((cashRegister) => ({
          ...cashRegister,
          created_at: cashRegister.opening_date,
          record_type: 'opening',
          movement_type: 'income',
          amount: cashRegister.opening_amount || 0,
          reason: 'Apertura de caja',
        })),
        ...validPayments
          .filter((payment) => payment.payment_method === 'cash')
          .map((payment) => ({
            ...payment,
            record_type: 'payment',
            movement_type: 'income',
            seller_name: validSalesById.get(payment.id_sale)?.seller_name || 'Sin vendedor',
            amount: payment.amount || 0,
            reason: validSalesById.get(payment.id_sale)?.folio || 'Venta en efectivo',
          })),
        ...audits.map((audit) => ({ ...audit, record_type: 'audit' })),
        ...movements.map((movement) => ({ ...movement, record_type: 'movement', movement_type: movement.type })),
      ],
      credits,
      inventory,
      inventoryAudits,
      purchases,
    },
    catalogs,
  }
}

export async function getReports(filters: ReportFilters = {}) {
  try {
    return response(true, 'Reportes generados', await aggregateReport(filters))
  } catch (err) {
    logger.error({ type: 'GET REPORTS ERROR', message: `${err}`, data: err })
    return response(false, 'Error al generar los reportes', err)
  }
}
