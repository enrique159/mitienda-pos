import Http from '../../network/Http.js'
import { initialConfiguration } from '../../shared/routes.js'
import { response, logger } from '../../helpers/index.js'

const http = new Http()

export async function fetchInitialConfiguration(payload) {
  try {
    const url = initialConfiguration(Http.baseUrl)
    const apiResponse = await http.post(url, { data: payload })
    return response(true, 'Configuración exitosa', apiResponse.data)
  } catch (err) {
    logger.error({ type: 'INITIAL CONFIGURATION ERROR', message: `${err}`, data: err })
    return response(false, 'Error en la configuración inicial', err.errors || err.message || err)
  }
}
