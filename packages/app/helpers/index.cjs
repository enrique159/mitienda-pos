const logger = require('./logger.cjs')
const {
  getDatetime,
  getToday,
  getUTCToday,
  getDatetimeForFile,
  getPaymentDueDate,
  ticketDateFormatter,
  ticketDateFormatterTimezone,
} = require('./datetime.cjs')
const {
  camelToSnakeCase,
  stringCamelToSnakeCase,
} = require('./keyConverter.cjs')
const { generateQRCode } = require('./qr.cjs')
const { saveFile, selectFile } = require('./files.cjs')
const { cleanAllTables } = require('./database.cjs')
const {
  formatCurrency,
  formatWithoutSymbol,
  formatCurrencySimple,
} = require('./currency.cjs')

const parseBoolean = (value) => value === '1' || value === 1 || value === true
const parseArrayJson = (value) => (value ? JSON.parse(value) : [])
const parseObjectJson = (value) => (value ? JSON.parse(value) : {})
const response = (success, message, response) => ({
  success,
  message,
  response,
})

module.exports = {
  parseBoolean,
  parseArrayJson,
  parseObjectJson,
  response,
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
