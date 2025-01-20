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
exports.createSale = async function (sale) {
  return await knex('sales').insert(sale).returning('id')
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

exports.createSaleDetail = async function (saleDetail) {
  return await knex('sale_details').insert(saleDetail)
    .then((saleDetail) => {
      return response(true, 'Detalle de venta creado', saleDetail)
    })
    .catch((err) => {
      console.log(err)
      logger.error({ type: 'CREATE SALE DETAIL ERROR', message: `${err}`, data: err })
      return response(false, 'Error al crear el detalle de la venta', err)
    })
}

exports.createSalePayment = async function (salePayment) {
  return await knex('sale_payments').insert(salePayment)
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
    const sales = await knex('sales').where('created_at', '>=', getUTCToday()).select()
    const todayString = getToday()
    if (!sales.length) {
      const branch = await knex('branches').select('branch_alias').first()
      return response(true, 'Folio generado', { folio: `${branch.branch_alias}-${todayString}-0001` })
    }
    const lastSale = sales[sales.length - 1]
    const lastFolio = lastSale.folio
    const lastFolioNumber = parseInt(lastFolio.split('-')[2])
    const newFolioNumber = (lastFolioNumber + 1).toString().padStart(4, '0')
    return response(true, 'Folio generado', { folio: `${lastFolio.split('-')[0]}-${todayString}-${newFolioNumber}` })
  } catch (err) {
    console.log(err)
    logger.error({ type: 'GENERATE SALE FOLIO ERROR', message: `${err}`, data: err })
    return response(false, 'Error al generar el folio de la venta', err)
  }
}