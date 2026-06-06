import knexFactory from 'knex'
import knexConfig from '../../database/knexfile'
import { logger, response } from '../../helpers/index'
import type { AppResponse, UUID } from '../../shared/types'
import type { CreateProvider, Provider, UpdateProvider } from '../../shared/providerTypes'

const knex = knexFactory(knexConfig)

function normalizeProvider(provider: Provider): Provider {
  return provider
}

function normalizeError(err: unknown): unknown {
  return err instanceof Error ? err.message : err
}

export async function getProviders(): Promise<AppResponse<Provider[]>> {
  try {
    const providers = await knex<Provider>('providers').select('*')
    if (!providers.length) {
      logger.error({ type: 'GET PROVIDERS', message: 'No se encontraron proveedores' })
      return response(true, 'Proveedores no encontrados', [])
    }
    return response(true, 'Proveedores encontrados', providers.map(normalizeProvider))
  } catch (err) {
    logger.error({ type: 'GET PROVIDERS ERROR', message: `${err}`, data: err })
    return response(false, 'Error al traer los proveedores', normalizeError(err) as Provider[])
  }
}

export async function getProviderById(id: UUID): Promise<AppResponse<Provider | null>> {
  try {
    const provider = await knex<Provider>('providers')
      .where({ id })
      .first()

    if (!provider) {
      logger.error({ type: 'GET PROVIDER', message: 'Proveedor no encontrado' })
      return response(false, 'Proveedor no encontrado', null)
    }
    return response(true, 'Proveedor encontrado', normalizeProvider(provider))
  } catch (err) {
    logger.error({ type: 'GET PROVIDER ERROR', message: `${err}`, data: err })
    return response(false, 'Error al traer el proveedor', null)
  }
}

export async function createProvider(provider: CreateProvider): Promise<AppResponse<Provider[]>> {
  try {
    const createdProvider = await knex<Provider>('providers')
      .insert(provider)
      .returning('*') as Provider[]

    logger.info({ type: 'CREATE PROVIDER', message: 'Proveedor creado exitosamente', data: createdProvider })
    return response(true, 'Proveedor creado exitosamente', createdProvider)
  } catch (err) {
    logger.error({ type: 'CREATE PROVIDER ERROR', message: `${err}`, data: err })
    return response(false, 'Error al crear el proveedor', normalizeError(err) as Provider[])
  }
}

export async function updateProvider(data: UpdateProvider): Promise<AppResponse<Provider[]>> {
  const dataToUpdate: Record<string, unknown> = {
    ...data,
    updated_at: knex.fn.now(),
    synced_at: null,
  }

  try {
    const updatedProvider = await knex<Provider>('providers')
      .where({ id: data.id })
      .update(dataToUpdate)
      .returning('*') as Provider[]

    logger.info({ type: 'UPDATE PROVIDER', message: 'Proveedor actualizado exitosamente', data: updatedProvider })
    return response(true, 'Proveedor actualizado exitosamente', updatedProvider)
  } catch (err) {
    logger.error({ type: 'UPDATE PROVIDER ERROR', message: `${err}`, data: err })
    return response(false, 'Error al actualizar el proveedor', normalizeError(err) as Provider[])
  }
}

export async function deleteProvider(id: UUID): Promise<AppResponse<Provider>> {
  try {
    const provider = await knex<Provider>('providers')
      .where({ id })
      .first()

    if (!provider) {
      logger.error({ type: 'DELETE PROVIDER', message: 'Proveedor no encontrado' })
      return response(false, 'Proveedor no encontrado', null as unknown as Provider)
    }

    await knex<Provider>('providers')
      .where({ id })
      .del()

    logger.info({ type: 'DELETE PROVIDER', message: 'Proveedor eliminado exitosamente', data: provider })
    return response(true, 'Proveedor eliminado exitosamente', provider)
  } catch (err) {
    logger.error({ type: 'DELETE PROVIDER ERROR', message: `${err}`, data: err })
    return response(false, 'Error al eliminar el proveedor', normalizeError(err) as Provider)
  }
}
