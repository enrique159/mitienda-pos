// @ts-nocheck
const knex = require('knex')(require('../../database/knexfile.cjs'))
const { response, logger, parseBoolean, camelToSnakeCase } = require('../../helpers/index.cjs')
const companyService = require('./companyService.cjs')

const normalizeCompany = (company) => {
  return {
    ...company,
    ai_enabled: parseBoolean(company.ai_enabled),
  }
}

exports.getPosCompany = async function () {
  const responseFetch = await companyService.fetchCompany()
  if (!responseFetch.success) {
    return responseFetch
  }
  try {
    const company = camelToSnakeCase(responseFetch.response)
    return await this.saveCompany(company)
  } catch (err) {
    logger.error({ type: 'GET POS COMPANY ERROR', message: `${err}`, data: err })
    return response(false, 'Error al obtener la empresa', err)
  }
}

exports.saveCompany = async function (company) {
  return await knex('company').insert(company).returning('*')
    .then((company) => {
      return response(true, 'Empresa guardada', normalizeCompany(company[0]))
    })
    .catch((err) => {
      logger.error({ type: 'SAVE COMPANY ERROR', message: `${err}`, data: err })
      return response(false, 'Error al guardar la empresa', err)
    })
}

exports.getCompany = async function () {
  return await knex('company').select().first()
    .then((company) => {
      return response(true, 'Empresa encontrada', normalizeCompany(company || {}))
    })
    .catch((err) => {
      logger.error({ type: 'GET COMPANY ERROR', message: `${err}`, data: err })
      return response(false, 'Error al obtener la información de la empresa', err)
    })
}

export {}
