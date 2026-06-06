// @ts-nocheck
const Http = require('../../network/Http.cjs')
const routes = require('../../shared/routes.cjs')
const { response, logger } = require('../../helpers/index.cjs')
const configurationRepository = require('../configuration/configurationRepository.cjs')

const http = new Http()

exports.fetchSellers = async function () {
  try {
    const { response: token } = await configurationRepository.getToken()
    const url = routes.getSellers(Http.baseUrl)
    const apiResponse = await http.get(url, { headers: token })
    return response(true, 'Vendedores encontrados', apiResponse.data)
  } catch (err) {
    logger.error({ type: 'GET SELLERS ERROR', message: `${err}`, data: err })
    return response(false, 'Error al traer los vendedores', err.errors || err.message || err)
  }
}
export {}
