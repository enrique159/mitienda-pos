class BaseError extends Error {
  errors: unknown[]
  warnings: unknown[]
  dataErrors: unknown[]

  constructor(
    errors: unknown | unknown[] = [],
    warnings: unknown | unknown[] = [],
    dataErrors: unknown | unknown[] = []
  ) {
    super()
    this.errors = Array.isArray(errors) ? errors : [errors]
    this.warnings = Array.isArray(warnings) ? warnings : [warnings]
    this.dataErrors = Array.isArray(dataErrors) ? dataErrors : [dataErrors]
  }
}

export { BaseError }

