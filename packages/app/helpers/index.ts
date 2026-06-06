import logger from './logger'
import {
  getDatetime,
  getToday,
  getUTCToday,
  getDatetimeForFile,
  getPaymentDueDate,
  ticketDateFormatter,
  ticketDateFormatterTimezone,
} from './datetime'
import { camelToSnakeCase, stringCamelToSnakeCase } from './keyConverter'
import { generateQRCode } from './qr'
import { saveFile, selectFile } from './files'
import { cleanAllTables } from './database'
import {
  formatCurrency,
  formatWithoutSymbol,
  formatCurrencySimple,
} from './currency'
import type { AppResponse } from '../shared/types'

export const parseBoolean = (value: unknown): boolean => value === '1' || value === 1 || value === true
export const parseArrayJson = <T = unknown>(value: string | null | undefined): T[] => (value ? JSON.parse(value) : [])
export const parseObjectJson = <T extends object = Record<string, unknown>>(value: string | null | undefined): T => (
  value ? JSON.parse(value) : {} as T
)
export const response = <T = null>(success: boolean, message: string, response: T = null as T): AppResponse<T> => ({
  success,
  message,
  response,
})

export {
  logger,
  getDatetime,
  getToday,
  getUTCToday,
  getPaymentDueDate,
  getDatetimeForFile,
  ticketDateFormatter,
  ticketDateFormatterTimezone,
  generateQRCode,
  selectFile,
  saveFile,
  cleanAllTables,
  camelToSnakeCase,
  stringCamelToSnakeCase,
  formatCurrency,
  formatWithoutSymbol,
  formatCurrencySimple,
}
