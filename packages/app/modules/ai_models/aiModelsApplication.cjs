const { ipcMain } = require('electron')
const aiModelsRepository = require('./aiModelsRepository.cjs')

/*
  ** ******** OBTENER TODOS LOS MODELOS DE IA ********
*/
ipcMain.on('get_ai_models', async (event) => {
  const response = await aiModelsRepository.getAiModels()
  event.reply('get_ai_models', response)
})

/*
  ** ******** OBTENER MODELO DE IA POR ID ********
*/
ipcMain.on('get_ai_model_by_id', async (event, id) => {
  const response = await aiModelsRepository.getAiModelById(id)
  event.reply('get_ai_model_by_id', response)
})

/*
  ** ******** CREAR UN MODELO DE IA ********
*/
ipcMain.on('create_ai_model', async (event, aiModel) => {
  const response = await aiModelsRepository.createAiModel(aiModel)
  event.reply('create_ai_model', response)
})

/*
  ** ******** ACTUALIZAR UN MODELO DE IA ********
*/
ipcMain.on('update_ai_model', async (event, payload) => {
  const { id, aiModel } = payload
  const response = await aiModelsRepository.updateAiModel(id, aiModel)
  event.reply('update_ai_model', response)
})

/*
  ** ******** ELIMINAR UN MODELO DE IA ********
*/
ipcMain.on('delete_ai_model', async (event, id) => {
  const response = await aiModelsRepository.deleteAiModel(id)
  event.reply('delete_ai_model', response)
})

/*
  ** ******** ACTUALIZAR ESTADO DE UN MODELO DE IA ********
*/
ipcMain.on('update_ai_model_status', async (event, payload) => {
  const { id, status } = payload
  const response = await aiModelsRepository.updateAiModelStatus(id, status)
  event.reply('update_ai_model_status', response)
})

/*
  ** ******** ESTABLECER MODELO DE IA POR DEFECTO ********
*/
ipcMain.on('set_default_ai_model', async (event, payload) => {
  const { id, companyId } = payload
  const response = await aiModelsRepository.setDefaultAiModel(id, companyId)
  event.reply('set_default_ai_model', response)
})
