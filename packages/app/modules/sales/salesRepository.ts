import knexFactory from 'knex'
import knexConfig from '../../database/knexfile.js'
const knex = knexFactory(knexConfig)
import { response, logger, parseBoolean, getUTCToday, getToday } from '../../helpers/index.js'

function normalizeSale(sale) {
  return {
    ...sale,
    on_trust: parseBoolean(sale.on_trust),
    is_ticket_printed: parseBoolean(sale.is_ticket_printed),
  }
}

/*
  ** ******** CREACION DE UNA VENTA ********
*/
export async function createSale(sale, trx) {
  const queryBuilder = trx ? knex('sales').transacting(trx) : knex('sales')
  return await queryBuilder.insert(sale).returning('id')
    .then((sale) => {
      logger.info({ type: 'CREATE SALE', message: 'Venta creada', data: Array.isArray(sale) ? sale[0] : sale })
      return response(true, 'Venta creada', Array.isArray(sale) ? sale[0] : sale)
    })
    .catch((err) => {
      logger.error({ type: 'CREATE SALE ERROR', message: `${err}`, data: err })
      return response(false, 'Error al crear la venta', err)
    })
}

export async function createSaleDetail(saleDetail, trx) {
  saleDetail.taxes = saleDetail.taxes.length ? JSON.stringify(saleDetail.taxes) : []
  const queryBuilder = trx ? knex('sale_details').transacting(trx) : knex('sale_details')
  return await queryBuilder.insert(saleDetail)
    .then((saleDetail) => {
      return response(true, 'Detalle de venta creado', saleDetail)
    })
    .catch((err) => {
      logger.error({ type: 'CREATE SALE DETAIL ERROR', message: `${err}`, data: err })
      return response(false, 'Error al crear el detalle de la venta', err)
    })
}

export async function createSalePayment(salePayment, trx) {
  const queryBuilder = trx ? knex('sale_payments').transacting(trx) : knex('sale_payments')
  return await queryBuilder.insert(salePayment)
    .then((salePayment) => {
      return response(true, 'Pago de venta creado', salePayment)
    })
    .catch((err) => {
      logger.error({ type: 'CREATE SALE PAYMENT ERROR', message: `${err}`, data: err })
      return response(false, 'Error al crear el pago de la venta', err)
    })
}


/*
  ** ******** OBTENER VENTAS ********
*/
export async function getSales() {
  try {
    const sales = await knex('sales').select().orderBy('created_at', 'desc')
    if (!sales.length) {
      logger.error({ type: 'GET SALES', message: 'No se encontraron ventas' })
      return response(true, 'Ventas no encontradas', [])
    }

    const salesWithDetails = await Promise.all(sales.map(async (sale) => {
      const details = await knex('sale_details').where('id_sale', sale.id).select()
      const payments = await knex('sale_payments').where('id_sale', sale.id).select()
      const seller = await knex('sellers').where('id', sale.id_seller).select().first()

      return {
        ...normalizeSale(sale),
        details,
        payments,
        seller_name: seller.name,
      }
    }))

    return response(true, 'Ventas encontradas', salesWithDetails)
  } catch (err) {
    logger.error({ type: 'GET SALES ERROR', message: `${err}`, data: err })
    return response(false, 'Error al traer las ventas', err)
  }
}



/*
  ** ******** OBTENER VENTAS DE TURNO ********
*/
export async function getSalesInTurn(idCashRegister) {
  try {
    const sales = await knex('sales').where('id_cash_register', idCashRegister).select().orderBy('created_at', 'desc')
    if (!sales.length) {
      logger.error({ type: 'GET SALES IN TURN', message: 'No se encontraron ventas' })
      return response(true, 'Ventas no encontradas', [])
    }

    const salesWithDetails = await Promise.all(sales.map(async (sale) => {
      const details = await knex('sale_details').where('id_sale', sale.id).select()
      const payments = await knex('sale_payments').where('id_sale', sale.id).select()
      const seller = await knex('sellers').where('id', sale.id_seller).select().first()

      return {
        ...normalizeSale(sale),
        details,
        payments,
        seller_name: seller.name,
      }
    }))

    return response(true, 'Ventas encontradas', salesWithDetails)
  } catch (err) {
    logger.error({ type: 'GET SALES IN TURN ERROR', message: `${err}`, data: err })
    return response(false, 'Error al traer las ventas', err)
  }
}

/*
  ** ******** GENERAR EL SIGUIENTE FOLIO DE VENTA ********
*/
export async function generateSaleFolio() {
  try {
    const todayString = getToday()
    const timestamp = Math.floor((Date.now() / 1000) % 1000000)

    const branch = await knex('branches').select('branch_alias').first()
    return response(true, 'Folio generado', { folio: `${branch.branch_alias}-${todayString}-${timestamp}` })
  } catch (err) {
    logger.error({ type: 'GENERATE SALE FOLIO ERROR', message: `${err}`, data: err })
    return response(false, 'Error al generar el folio de la venta', err)
  }
}
