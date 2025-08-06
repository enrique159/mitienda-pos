class BaseError extends Error {
  constructor(
    errors = [],
    warnings = [],
    dataErrors = []
  ) {
    super()
    this.errors = Array.isArray(errors) ? errors : [errors]
    this.warnings = Array.isArray(warnings) ? warnings : [warnings]
    this.dataErrors = Array.isArray(dataErrors) ? dataErrors : [dataErrors]
  }
}

module.exports = { BaseError }
