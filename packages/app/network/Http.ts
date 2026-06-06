import axios, { AxiosError, type AxiosInstance } from 'axios'
import Exception from '../shared/error/Exception'
import { NetworkStatusCode as HttpStatusCode } from '../shared/enums/networkStatusCode'
import { API_URL } from '../../env.json'

const TIME_OUT = 10000
const WITH_CREDENTIALS = false

type HttpHeaders = Record<string, string>

interface HttpPayload<TData = unknown> {
  params?: Record<string, unknown>
  headers?: HttpHeaders
  timeout?: number
  auth?: boolean
  data?: TData
}

interface ErrorResponse {
  status: number
  message: string | string[]
}

class Http {
  private axios!: AxiosInstance

  constructor() {
    this.instanceAxios()
  }

  static get baseUrl(): string {
    return API_URL
  }

  requestHeaders(headers: HttpHeaders = {}): HttpHeaders {
    return {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...headers,
    }
  }

  instanceAxios(): void {
    this.axios = axios.create()
  }

  async get<TResponse = any>(url: string, payload?: HttpPayload): Promise<TResponse> {
    try {
      const response = await this.axios.get<TResponse>(url, {
        params: payload?.params,
        headers: this.requestHeaders(payload?.headers),
        timeout: payload?.timeout ?? TIME_OUT,
        withCredentials: payload?.auth || WITH_CREDENTIALS,
      })

      return response.data
    } catch (err) {
      return handleException(err)
    }
  }

  async post<TResponse = any, TData = unknown>(url: string, payload?: HttpPayload<TData>): Promise<TResponse> {
    try {
      const response = await this.axios.post<TResponse>(url, payload?.data ?? {}, {
        params: payload?.params,
        headers: this.requestHeaders(payload?.headers),
        data: payload?.data ?? {},
        timeout: payload?.timeout ?? TIME_OUT,
        withCredentials: payload?.auth || WITH_CREDENTIALS,
      })

      return response.data
    } catch (err) {
      return handleException(err)
    }
  }

  async put<TResponse = any, TData = unknown>(url: string, payload?: HttpPayload<TData>): Promise<TResponse> {
    try {
      const response = await this.axios.put<TResponse>(url, payload?.data ?? {}, {
        params: payload?.params,
        headers: this.requestHeaders(payload?.headers),
        data: payload?.data ?? {},
        timeout: payload?.timeout ?? TIME_OUT,
        withCredentials: payload?.auth || WITH_CREDENTIALS,
      })

      return response.data
    } catch (err) {
      return handleException(err)
    }
  }

  async delete<TResponse = any>(url: string, payload?: HttpPayload): Promise<TResponse> {
    try {
      const response = await this.axios.delete<TResponse>(url, {
        params: payload?.params,
        headers: this.requestHeaders(payload?.headers),
        timeout: payload?.timeout ?? TIME_OUT,
        withCredentials: payload?.auth || WITH_CREDENTIALS,
      })

      return response.data
    } catch (err) {
      return handleException(err)
    }
  }

  async patch<TResponse = any, TData = unknown>(url: string, payload?: HttpPayload<TData>): Promise<TResponse> {
    try {
      const response = await this.axios.patch<TResponse>(url, payload?.data ?? {}, {
        params: payload?.params,
        headers: this.requestHeaders(payload?.headers),
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

const handleException = (err: unknown): never => {
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

    const errorResponse: ErrorResponse = {
      status: HttpStatusCode.INTERNAL_SERVER_ERROR,
      message: 'Ha ocurrido un error en el servidor, contacta a soporte.',
    }
    const responseData = err.response?.data as { message?: string | string[], error?: string } | undefined
    if (
      responseData &&
      err.response?.status !== HttpStatusCode.INTERNAL_SERVER_ERROR
    ) {
      errorResponse.message = responseData.message ?? responseData.error ?? errorResponse.message
      errorResponse.status = err.response?.status ?? errorResponse.status
    }
    throw new Exception(
      errorResponse.status ??
        err.response?.status ??
        HttpStatusCode.INTERNAL_SERVER_ERROR,
      Array.isArray(errorResponse.message)
        ? errorResponse.message
        : [errorResponse.message]
    )
  }

  console.log('Unexpected error: ', err)
  throw new Exception(HttpStatusCode.INTERNAL_SERVER_ERROR, [
    'Ha ocurrido un error en el servidor, contacta a soporte.',
  ])
}

export = Http
