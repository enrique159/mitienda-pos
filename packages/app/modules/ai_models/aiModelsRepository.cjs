const knex = require('knex')(require('../../database/knexfile.cjs'))
const { response, logger } = require('../../helpers/index.cjs')

/*
  ** ******** OBTENER MODELOS DE IA ********
*/
exports.getAiModels = async function () {
  try {
    const aiModels = await knex('ai_models').select().orderBy('created_at', 'desc')
    if (!aiModels.length) {
      logger.error({ type: 'GET AI MODELS', message: 'No se encontraron modelos de IA' })
      return response(true, 'Modelos de IA no encontrados', [])
    }

    return response(true, 'Modelos de IA encontrados', aiModels)
  } catch (err) {
    console.log(err)
    logger.error({ type: 'GET AI MODELS ERROR', message: `${err}`, data: err })
    return response(false, 'Error al obtener los modelos de IA', err)
  }
}

/*
  ** ******** OBTENER MODELO DE IA POR ID ********
*/
exports.getAiModelById = async function (id) {
  try {
    const aiModel = await knex('ai_models').where('id', id).first()
    if (!aiModel) {
      logger.error({ type: 'GET AI MODEL BY ID', message: 'Modelo de IA no encontrado' })
      return response(false, 'Modelo de IA no encontrado', null)
    }

    return response(true, 'Modelo de IA encontrado', aiModel)
  } catch (err) {
    console.log(err)
    logger.error({ type: 'GET AI MODEL BY ID ERROR', message: `${err}`, data: err })
    return response(false, 'Error al obtener el modelo de IA', err)
  }
}

/*
  ** ******** CREAR UN MODELO DE IA ********
*/
exports.createAiModel = async function (aiModel) {
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

    const [id] = await knex('ai_models').insert(dataToInsert).returning('id')

    logger.info({ type: 'CREATE AI MODEL', message: 'Modelo de IA creado', data: { id } })
    return response(true, 'Modelo de IA creado', { id, ...aiModel })
  } catch (err) {
    console.log(err)
    logger.error({ type: 'CREATE AI MODEL ERROR', message: `${err}`, data: err })
    return response(false, 'Error al crear el modelo de IA', err)
  }
}

/*
  ** ******** ACTUALIZAR UN MODELO DE IA ********
*/
exports.updateAiModel = async function (id, aiModel) {
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
      return response(true, 'Modelo de IA actualizado', { id, ...aiModel })
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
exports.deleteAiModel = async function (id) {
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
exports.updateAiModelStatus = async function (id, status) {
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
exports.setDefaultAiModel = async function (id, companyId) {
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
