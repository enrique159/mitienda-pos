// @ts-nocheck
const Http = require('../../network/Http.cjs')
const { initialConfiguration } = require('../../shared/routes.cjs')
const { response, logger } = require('../../helpers/index.cjs')

const http = new Http()

exports.fetchInitialConfiguration = async function (payload) {
  try {
    const url = initialConfiguration(Http.baseUrl)
    const apiResponse = await http.post(url, { data: payload })
    return response(true, 'Configuración exitosa', apiResponse.data)
  } catch (err) {
    logger.error({ type: 'INITIAL CONFIGURATION ERROR', message: `${err}`, data: err })
    return response(false, 'Error en la configuración inicial', err.errors || err.message || err)
  }
}
export {}
