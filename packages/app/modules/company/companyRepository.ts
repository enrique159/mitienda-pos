import knexFactory from 'knex'
import knexConfig from '../../database/knexfile.js'
const knex = knexFactory(knexConfig)
import { response, logger, parseBoolean, camelToSnakeCase } from '../../helpers/index.js'
import * as companyService from './companyService.js'

const normalizeCompany = (company) => {
  return {
    ...company,
    ai_enabled: parseBoolean(company.ai_enabled),
  }
}

export async function getPosCompany() {
  const responseFetch = await companyService.fetchCompany()
  if (!responseFetch.success) {
    return responseFetch
  }
  try {
    const company = camelToSnakeCase(responseFetch.response)
    return await saveCompany(company)
  } catch (err) {
    logger.error({ type: 'GET POS COMPANY ERROR', message: `${err}`, data: err })
    return response(false, 'Error al obtener la empresa', err)
  }
}

export async function saveCompany(company) {
  return await knex('company').insert(company).returning('*')
    .then((company) => {
      return response(true, 'Empresa guardada', normalizeCompany(company[0]))
    })
    .catch((err) => {
      logger.error({ type: 'SAVE COMPANY ERROR', message: `${err}`, data: err })
      return response(false, 'Error al guardar la empresa', err)
    })
}

export async function getCompany() {
  return await knex('company').select().first()
    .then((company) => {
      return response(true, 'Empresa encontrada', normalizeCompany(company || {}))
    })
    .catch((err) => {
      logger.error({ type: 'GET COMPANY ERROR', message: `${err}`, data: err })
      return response(false, 'Error al obtener la información de la empresa', err)
    })
}
