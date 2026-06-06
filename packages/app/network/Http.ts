// @ts-nocheck
const axios = require('axios')
const { AxiosError } = axios
const Exception = require('../shared/error/Exception.cjs')
const {
  NetworkStatusCode: HttpStatusCode,
} = require('../shared/enums/networkStatusCode.cjs')
const { API_URL } = require('../../env.json')

const TIME_OUT = 10000
const WITH_CREDENTIALS = false

class Http {
  constructor() {
    this.axios = null
    this.instanceAxios()
  }

  static get baseUrl() {
    return API_URL
  }

  requestHeaders(headers) {
    return {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...headers,
    }
  }

  instanceAxios() {
    this.axios = axios.create()
  }

  /*
   *********** GET ***********
   */
  async get(url, payload) {
    try {
      const response = await this.axios.get(url, {
        params: payload?.params,
        headers: this.requestHeaders(payload?.headers ?? {}),
        timeout: payload?.timeout ?? TIME_OUT,
        withCredentials: payload?.auth || WITH_CREDENTIALS,
      })

      return response.data
    } catch (err) {
      return handleException(err)
    }
  }

  /*
   *********** POST ***********
   */
  async post(url, payload) {
    try {
      const response = await this.axios.post(url, payload?.data ?? {}, {
        params: payload?.params,
        headers: this.requestHeaders(payload?.headers ?? {}),
        data: payload?.data ?? {},
        timeout: payload?.timeout ?? TIME_OUT,
        withCredentials: payload?.auth || WITH_CREDENTIALS,
      })

      return response.data
    } catch (err) {
      return handleException(err)
    }
  }

  /*
   *********** PUT ***********
   */
  async put(url, payload) {
    try {
      const response = await this.axios.put(url, payload?.data ?? {}, {
        params: payload?.params,
        headers: this.requestHeaders(payload?.headers ?? {}),
        data: payload?.data ?? {},
        timeout: payload?.timeout ?? TIME_OUT,
        withCredentials: payload?.auth || WITH_CREDENTIALS,
      })

      return response.data
    } catch (err) {
      return handleException(err)
    }
  }

  /*
   *********** DELETE ***********
   */
  async delete(url, payload) {
    try {
      const response = await this.axios.delete(url, {
        params: payload?.params,
        headers: this.requestHeaders(payload?.headers ?? {}),
        timeout: payload?.timeout ?? TIME_OUT,
        withCredentials: payload?.auth || WITH_CREDENTIALS,
      })

      return response.data
    } catch (err) {
      return handleException(err)
    }
  }

  /*
   *********** PATCH ***********
   */
  async patch(url, payload) {
    try {
      const response = await this.axios.patch(url, {
        params: payload?.params,
        headers: this.requestHeaders(payload?.headers ?? {}),
        data: payload?.data ?? {},
        timeout: payload?.timeout ?? TIME_OUT,
        withCredentials: payload?.auth || WITH_CREDENTIALS,
      })

      return response.data
    } catch (err) {
      return handleException(err)
    }
  }
}

const handleException = (err) => {
  if (err instanceof AxiosError) {
    if (err.code === 'ECONNABORTED') {
      throw new Exception(HttpStatusCode.REQUEST_TIMEOUT, [
        'El tiempo de respuesta se ha excedido, intenta de nuevo.',
      ])
    }
    if (err.code === 'ERR_NETWORK') {
      throw new Exception(HttpStatusCode.INTERNAL_SERVER_ERROR, [
        'Parece que ocurre un error de red, intenta de nuevo.',
      ])
    }
    if (err.code === 'ECONNREFUSED') {
      throw new Exception(HttpStatusCode.INTERNAL_SERVER_ERROR, [
        'Parece que el servidor no está disponible, intente más tarde.',
      ])
    }
    let errorResponse = {
      status: HttpStatusCode.INTERNAL_SERVER_ERROR,
      message: 'Ha ocurrido un error en el servidor, contacta a soporte.',
    }
    if (
      err.response?.data &&
      err.response?.status !== HttpStatusCode.INTERNAL_SERVER_ERROR
    ) {
      errorResponse.message = err.response?.data.message ?? err.response?.data.error
      errorResponse.status = err.response?.status
    }
    throw new Exception(
      errorResponse.status ??
        err.response?.status ??
        HttpStatusCode.INTERNAL_SERVER_ERROR,
      Array.isArray(errorResponse.message)
        ? errorResponse.message
        : [errorResponse.message]
    )
  } else {
    console.log('🚨 Unexpected error: ', err)
    throw new Exception(HttpStatusCode.INTERNAL_SERVER_ERROR, [
      'Ha ocurrido un error en el servidor, contacta a soporte.',
    ])
  }
}

module.exports = Http

export {}
