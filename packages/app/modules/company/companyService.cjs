const Http = require('../../network/Http.cjs')
const routes = require('../../shared/routes.cjs')
const { response, logger } = require('../../helpers/index.cjs')
const configurationRepository = require('../configuration/configurationRepository.cjs')

const http = new Http()

exports.fetchCompany = async function () {
  try {
    const { response: token } = await configurationRepository.getToken()
    const url = routes.getPosCompany(Http.baseUrl)
    const apiResponse = await http.get(url, { headers: token })
    return response(true, 'Configuración exitosa', apiResponse.data)
  } catch (err) {
    logger.error({ type: 'GET COMPANY ERROR', message: `${err}`, data: err })
    return response(false, 'Error al traer la configuración', err.errors || err.message || err)
  }
}