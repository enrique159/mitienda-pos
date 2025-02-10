const knex = require('knex')(require('../../database/knexfile.cjs'))
const { response, logger, parseBoolean, getUTCToday, getToday } = require('../../helpers/index.cjs')

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
exports.createSale = async function (sale, trx) {
  const queryBuilder = trx ? knex('sales').transacting(trx) : knex('sales')
  return await queryBuilder.insert(sale).returning('id')
    .then((sale) => {
      logger.info({ type: 'CREATE SALE', message: 'Venta creada', data: Array.isArray(sale) ? sale[0] : sale })
      return response(true, 'Venta creada', Array.isArray(sale) ? sale[0] : sale)
    })
    .catch((err) => {
      console.log(err)
      logger.error({ type: 'CREATE SALE ERROR', message: `${err}`, data: err })
      return response(false, 'Error al crear la venta', err)
    })
}

exports.createSaleDetail = async function (saleDetail, trx) {
  saleDetail.taxes = saleDetail.taxes.length ? JSON.stringify(saleDetail.taxes) : []
  const queryBuilder = trx ? knex('sale_details').transacting(trx) : knex('sale_details')
  return await queryBuilder.insert(saleDetail)
    .then((saleDetail) => {
      return response(true, 'Detalle de venta creado', saleDetail)
    })
    .catch((err) => {
      console.log(err)
      logger.error({ type: 'CREATE SALE DETAIL ERROR', message: `${err}`, data: err })
      return response(false, 'Error al crear el detalle de la venta', err)
    })
}

exports.createSalePayment = async function (salePayment, trx) {
  const queryBuilder = trx ? knex('sale_payments').transacting(trx) : knex('sale_payments')
  return await queryBuilder.insert(salePayment)
    .then((salePayment) => {
      return response(true, 'Pago de venta creado', salePayment)
    })
    .catch((err) => {
      console.log(err)
      logger.error({ type: 'CREATE SALE PAYMENT ERROR', message: `${err}`, data: err })
      return response(false, 'Error al crear el pago de la venta', err)
    })
}


/*
  ** ******** OBTENER VENTAS ********
*/
exports.getSales = async function () {
  try {
    const sales = await knex('sales').select()
    if (!sales.length) {
      logger.error({ type: 'GET SALES', message: 'No se encontraron ventas' })
      return response(false, 'Ventas no encontradas', [])
    }

    const salesWithDetails = await Promise.all(sales.map(async (sale) => {
      const details = await knex('sale_details').where('id_sale', sale.id).select()
      return {
        ...normalizeSale(sale),
        details,
      }
    }))

    return response(true, 'Ventas encontradas', salesWithDetails)
  } catch (err) {
    console.log(err)
    logger.error({ type: 'GET SALES ERROR', message: `${err}`, data: err })
    return response(false, 'Error al traer las ventas', err)
  }
}



/*
  ** ******** GENERAR EL SIGUIENTE FOLIO DE VENTA ********
*/
exports.generateSaleFolio = async function () {
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