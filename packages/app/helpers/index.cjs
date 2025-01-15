const logger = require('./logger.cjs')
const { getDatetime } = require('./datetime.cjs')

exports.parseBoolean = function (value) {
  return value === '1' || value === 1 || value === true
}

exports.response = function (success, message, response) {
  return { success, message, response }
}

exports.logger = logger
exports.getDatetime = getDatetime