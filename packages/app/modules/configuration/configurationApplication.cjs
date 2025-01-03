const { ipcMain } = require('electron')
const { getConfiguration, updateConfiguration, createConfiguration } = require('./configurationRepository.cjs')
const documents = require('../documents/documentsRepository.cjs')
const areas = require('../areas/areasRepository.cjs')
const actors = require('../actors/actorsRepository.cjs')
const activities = require('../activities/activitiesRepository.cjs')
const path = require('path')
const os = require('os')
const logger = require('../../helpers/logger.cjs')

ipcMain.on('get_configuration', async (event) => {
  const response = await getConfiguration()
  event.reply('get_configuration', response)
})

ipcMain.on('update_configuration', async (event, data) => {
  const response = await updateConfiguration(data)
  event.reply('update_configuration', response)
})

ipcMain.on('create_configuration', async (event, data) => {
  data.ruta_recursos = path.join(os.homedir(), data.ruta_recursos ?? 'resources')
  const response = await createConfiguration(data)
  event.reply('create_configuration', response)
})

ipcMain.on('export_database', async (event) => {
  const response = {
    documents: await documents.getDocuments(),
    areas: await areas.getAreas(),
    actors: await actors.getActors(),
    activities: await activities.getAllActivities()
  }
  if (!response.documents.success || !response.areas.success || !response.actors.success || !response.activities.success) {
    logger.error({ type: 'EXPORT DATABASE', message: 'Error al exportar la base de datos', error: response })
    event.reply('export_database', { success: false, message: 'Error al exportar la base de datos' }, response)
    return
  }
  const rawResponse = {
    documents: response.documents.response,
    areas: response.areas.response,
    actors: response.actors.response,
    activities: response.activities.response
  }
  logger.info({ type: 'EXPORT DATABASE', message: 'Base de datos exportada correctamente' })
  event.reply('export_database', { success: true, message: 'Base de datos exportada correctamente', response: rawResponse })
})

ipcMain.on('import_database', async (event, data) => {
  const response = {
    areas: await areas.importAreas(data.areas),
    actors: await actors.importActors(data.actors),
    documents: await documents.importDocuments(data.documents),
    activities: await activities.importActivities(data.activities)
  }
  if (!response.documents.success || !response.areas.success || !response.actors.success || !response.activities.success) {
    logger.error({ type: 'IMPORT DATABASE', message: 'Error al importar la base de datos', error: response })
    event.reply('import_database', { success: false, message: 'Error al importar la base de datos' }, response)
    return
  }
  logger.info({ type: 'IMPORT DATABASE', message: 'Base de datos importada correctamente' })
  event.reply('import_database', { success: true, message: 'Datos importados correctamente', response })
})