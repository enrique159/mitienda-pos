const finish = (value: string, end: string): string =>
  value.endsWith(end) ? value : `${value}${end}`
const finishSlash = (value: string): string => finish(value, '/')

const initialConfiguration = (baseUrl: string): string => `${finishSlash(baseUrl)}pos/pos/install`
const getPosCompany = (baseUrl: string): string => `${finishSlash(baseUrl)}pos/pos/company`
const getBranchesByEmail = (baseUrl: string): string => `${finishSlash(baseUrl)}pos/companies/branches`
const getSellers = (baseUrl: string): string => `${finishSlash(baseUrl)}pos/sellers`

export {
  finish,
  finishSlash,
  initialConfiguration,
  getBranchesByEmail,
  getPosCompany,
  getSellers,
}

