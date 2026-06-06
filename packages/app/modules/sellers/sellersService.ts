import Http from '../../network/Http.js'
import * as routes from '../../shared/routes.js'
import { response, logger } from '../../helpers/index.js'
import * as configurationRepository from '../configuration/configurationRepository.js'

const http = new Http()

export async function fetchSellers() {
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
