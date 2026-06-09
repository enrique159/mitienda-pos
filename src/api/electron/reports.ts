import { ReportFilters, ReportsPayload, Response } from '@/api/interfaces'

export const getReports = async (filters: ReportFilters): Promise<Response<ReportsPayload>> => {
  return new Promise((resolve, reject) => {
    if (typeof window.electron.getReports !== 'function') {
      reject(new Error('El modulo de reportes no esta disponible. Reinicia la aplicacion.'))
      return
    }

    const timeout = window.setTimeout(() => {
      reject(new Error('No se recibio respuesta del modulo de reportes. Reinicia la aplicacion.'))
    }, 10000)

    window.electron.getReports(filters, (response: Response<ReportsPayload>) => {
      window.clearTimeout(timeout)
      resolve(response)
    })
  })
}
