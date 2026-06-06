// @ts-nocheck
const Http = require('../../network/Http.cjs')
const { getBranchesByEmail } = require('../../shared/routes.cjs')
const { response, logger } = require('../../helpers/index.cjs')

const http = new Http()

exports.fetchBranchesByEmail = async function (email) {
  try {
    const url = getBranchesByEmail(Http.baseUrl)
    const apiResponse = await http.post(url, { data: { email } })
    return response(true, 'Sucursales encontradas', apiResponse.data)
  } catch (err) {
    logger.error({ type: 'GET BRANCHES BY EMAIL ERROR', message: `${err}`, data: err })
    return response(false, 'Error al traer las sucursales', err.errors || err.message || err)
  }
}
export {}
