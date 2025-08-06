const { BaseError } = require('./BaseError.cjs')

class Exception extends BaseError {
  constructor(
    statusCode,
    errors,
    warnings,
    dataErrors
  ) {
    super(errors, warnings, dataErrors)
    this.name = 'Exception'
    this.statusCode = statusCode
    Object.setPrototypeOf(this, Exception.prototype)
  }
}

module.exports = Exception
