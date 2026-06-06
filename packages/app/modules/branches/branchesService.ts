import Http from '../../network/Http.js'
import { getBranchesByEmail } from '../../shared/routes.js'
import { response, logger } from '../../helpers/index.js'

const http = new Http()

export async function fetchBranchesByEmail(email) {
  try {
    const url = getBranchesByEmail(Http.baseUrl)
    const apiResponse = await http.post(url, { data: { email } })
    return response(true, 'Sucursales encontradas', apiResponse.data)
  } catch (err) {
    logger.error({ type: 'GET BRANCHES BY EMAIL ERROR', message: `${err}`, data: err })
    return response(false, 'Error al traer las sucursales', err.errors || err.message || err)
  }
}
