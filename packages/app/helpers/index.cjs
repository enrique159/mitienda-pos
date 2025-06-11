const logger = require('./logger.cjs')
const { getDatetime, getToday, getUTCToday, getDatetimeForFile, getPaymentDueDate } = require('./datetime.cjs')
const { generateQRCode } = require('./qr.cjs')
const { saveFile, selectFile } = require('./files.cjs')

const parseBoolean = (value) => value === '1' || value === 1 || value === true
const parseArrayJson = (value) => value ? JSON.parse(value) : []
const response = (success, message, response) => ({ success, message, response })

module.exports = {
  parseBoolean,
  parseArrayJson,
  response,
  logger,
  getDatetime,
  getToday,
  getUTCToday,
  getPaymentDueDate,
  getDatetimeForFile,
  generateQRCode,
  selectFile,
  saveFile,
}