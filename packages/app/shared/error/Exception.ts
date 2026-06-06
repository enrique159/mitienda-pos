import { BaseError } from './BaseError'
import type { NetworkStatusCode } from '../enums/networkStatusCode'

class Exception extends BaseError {
  statusCode: NetworkStatusCode | number

  constructor(
    statusCode: NetworkStatusCode | number,
    errors: unknown | unknown[] = [],
    warnings: unknown | unknown[] = [],
    dataErrors: unknown | unknown[] = []
  ) {
    super(errors, warnings, dataErrors)
    this.name = 'Exception'
    this.statusCode = statusCode
    Object.setPrototypeOf(this, Exception.prototype)
  }
}

export = Exception

