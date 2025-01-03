const logger = require('./logger.cjs')
const { getDatetime } = require('./datetime.cjs')

exports.response = function (success, message, response) {
  return { success, message, response }
}

exports.logger = logger
exports.getDatetime = getDatetime