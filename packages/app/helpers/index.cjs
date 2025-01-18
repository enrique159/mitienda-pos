const logger = require('./logger.cjs')
const { getDatetime, getToday, getUTCToday } = require('./datetime.cjs')

const parseBoolean = (value) => value === '1' || value === 1 || value === true
const response = (success, message, response) => ({ success, message, response })

module.exports = {
  parseBoolean,
  response,
  logger,
  getDatetime,
  getToday,
  getUTCToday,
}