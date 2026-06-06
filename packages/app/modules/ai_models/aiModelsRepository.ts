import knexFactory from 'knex'
import knexConfig from '../../database/knexfile.js'
const knex = knexFactory(knexConfig)
import { response, logger, parseBoolean } from '../../helpers/index.js'
import { ActiveStatus, AiModel, CreateAiModel, UpdateAiModel } from '../../domain/interfaces'

function normalizeAiModel(aiModel: Partial<AiModel>) {
  return {
    ...aiModel,
    default: parseBoolean(aiModel.default),
  }
}
/*
  ** ******** OBTENER MODELOS DE IA ********
*/
export async function getAiModels() {
  try {
    const aiModels = await knex('ai_models').select().orderBy('created_at', 'desc')
    if (!aiModels.length) {
      return response(true, 'Modelos de IA no encontrados', [])
    }
    const normalizedModels = aiModels.map(normalizeAiModel)

    return response(true, 'Modelos de IA encontrados', normalizedModels)
  } catch (err) {
    console.log(err)
    logger.error({ type: 'GET AI MODELS ERROR', message: `${err}`, data: err })
    return response(false, 'Error al obtener los modelos de IA', err)
  }
}

/*
  ** ******** OBTENER MODELO DE IA POR ID ********
*/
export async function getAiModelById(id: string) {
  try {
    const aiModel = await knex('ai_models').where('id', id).first()
    if (!aiModel) {
      logger.error({ type: 'GET AI MODEL BY ID', message: 'Modelo de IA no encontrado' })
      return response(false, 'Modelo de IA no encontrado', null)
    }

    return response(true, 'Modelo de IA encontrado', normalizeAiModel(aiModel))
  } catch (err) {
    console.log(err)
    logger.error({ type: 'GET AI MODEL BY ID ERROR', message: `${err}`, data: err })
    return response(false, 'Error al obtener el modelo de IA', err)
  }
}

/*
  ** ******** CREAR UN MODELO DE IA ********
*/
export async function createAiModel(aiModel: CreateAiModel) {
  const dataToInsert = {
    ...aiModel,
    synced_at: null,
  }

  try {
    // Si se marca como default, primero desactivamos cualquier otro modelo por defecto
    if (aiModel.default) {
      await knex('ai_models')
        .where('id_company', aiModel.id_company)
        .where('default', true)
        .update({ default: false, updated_at: knex.fn.now() })
    }

    const [createdAiModel] = await knex('ai_models').insert(dataToInsert).returning('*')

    logger.info({ type: 'CREATE AI MODEL', message: 'Modelo de IA creado', data: { id: createdAiModel.id } })
    return response(true, 'Modelo de IA creado', normalizeAiModel(createdAiModel))
  } catch (err) {
    console.log(err)
    logger.error({ type: 'CREATE AI MODEL ERROR', message: `${err}`, data: err })
    return response(false, 'Error al crear el modelo de IA', err)
  }
}

/*
  ** ******** ACTUALIZAR UN MODELO DE IA ********
*/
export async function updateAiModel(id: string, aiModel: UpdateAiModel) {
  const dataToUpdate = {
    ...aiModel,
    updated_at: knex.fn.now(),
    synced_at: null,
  }

  try {
    // Si se marca como default, primero desactivamos cualquier otro modelo por defecto
    if (aiModel.default) {
      await knex('ai_models')
        .where('id_company', aiModel.id_company)
        .where('default', true)
        .update({ default: false, updated_at: knex.fn.now() })
    }

    const updated = await knex('ai_models').where('id', id).update(dataToUpdate)
    if (updated) {
      logger.info({ type: 'UPDATE AI MODEL', message: 'Modelo de IA actualizado', data: { id, ...aiModel } })
      return response(true, 'Modelo de IA actualizado', normalizeAiModel({ id, ...aiModel }))
    } else {
      logger.error({ type: 'UPDATE AI MODEL', message: 'Modelo de IA no encontrado' })
      return response(false, 'Modelo de IA no encontrado', null)
    }
  } catch (err) {
    console.log(err)
    logger.error({ type: 'UPDATE AI MODEL ERROR', message: `${err}`, data: err })
    return response(false, 'Error al actualizar el modelo de IA', err)
  }
}

/*
  ** ******** ELIMINAR UN MODELO DE IA ********
*/
export async function deleteAiModel(id: string) {
  try {
    // Verificar si el modelo es el predeterminado
    const aiModel = await knex('ai_models').where('id', id).first()
    if (!aiModel) {
      logger.error({ type: 'DELETE AI MODEL', message: 'Modelo de IA no encontrado' })
      return response(false, 'Modelo de IA no encontrado', null)
    }

    // No permitir eliminar el modelo predeterminado
    if (aiModel.default) {
      logger.error({ type: 'DELETE AI MODEL', message: 'No se puede eliminar el modelo predeterminado' })
      return response(false, 'No se puede eliminar el modelo predeterminado', null)
    }

    const deleted = await knex('ai_models').where('id', id).del()
    if (deleted) {
      logger.info({ type: 'DELETE AI MODEL', message: 'Modelo de IA eliminado', data: { id } })
      return response(true, 'Modelo de IA eliminado', { id })
    } else {
      logger.error({ type: 'DELETE AI MODEL', message: 'Modelo de IA no encontrado' })
      return response(false, 'Modelo de IA no encontrado', null)
    }
  } catch (err) {
    console.log(err)
    logger.error({ type: 'DELETE AI MODEL ERROR', message: `${err}`, data: err })
    return response(false, 'Error al eliminar el modelo de IA', err)
  }
}

/*
  ** ******** CAMBIAR ESTADO DE UN MODELO DE IA ********
*/
export async function updateAiModelStatus(id: string, status: ActiveStatus) {
  try {
    const updated = await knex('ai_models')
      .where('id', id)
      .update({
        status,
        updated_at: knex.fn.now(),
        synced_at: null,
      })

    if (updated) {
      logger.info({ type: 'UPDATE AI MODEL STATUS', message: 'Estado del modelo de IA actualizado', data: { id, status } })
      return response(true, 'Estado del modelo de IA actualizado', { id, status })
    } else {
      logger.error({ type: 'UPDATE AI MODEL STATUS', message: 'Modelo de IA no encontrado' })
      return response(false, 'Modelo de IA no encontrado', null)
    }
  } catch (err) {
    console.log(err)
    logger.error({ type: 'UPDATE AI MODEL STATUS ERROR', message: `${err}`, data: err })
    return response(false, 'Error al actualizar el estado del modelo de IA', err)
  }
}

/*
  ** ******** ESTABLECER MODELO DE IA POR DEFECTO ********
*/
export async function setDefaultAiModel(id: string, companyId: string) {
  try {
    // Primero desactivamos cualquier modelo por defecto
    await knex('ai_models')
      .where('id_company', companyId)
      .where('default', true)
      .update({ default: false, updated_at: knex.fn.now() })

    // Luego establecemos el nuevo modelo por defecto
    const updated = await knex('ai_models')
      .where('id', id)
      .update({
        default: true,
        updated_at: knex.fn.now(),
        synced_at: null,
      })

    if (updated) {
      logger.info({ type: 'SET DEFAULT AI MODEL', message: 'Modelo de IA establecido como predeterminado', data: { id } })
      return response(true, 'Modelo de IA establecido como predeterminado', { id })
    } else {
      logger.error({ type: 'SET DEFAULT AI MODEL', message: 'Modelo de IA no encontrado' })
      return response(false, 'Modelo de IA no encontrado', null)
    }
  } catch (err) {
    console.log(err)
    logger.error({ type: 'SET DEFAULT AI MODEL ERROR', message: `${err}`, data: err })
    return response(false, 'Error al establecer el modelo de IA como predeterminado', err)
  }
}
