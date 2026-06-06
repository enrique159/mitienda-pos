import { ipcRenderer } from 'electron'

/*
  ** ******** OBTENER TODOS LOS MODELOS DE IA ********
*/
export function getAiModels(callback) {
  ipcRenderer.removeAllListeners('get_ai_models')
  ipcRenderer.on('get_ai_models', (_, response) => callback(response))
  ipcRenderer.send('get_ai_models')
}

/*
  ** ******** OBTENER MODELO DE IA POR ID ********
*/
export function getAiModelById(id, callback) {
  ipcRenderer.removeAllListeners('get_ai_model_by_id')
  ipcRenderer.on('get_ai_model_by_id', (_, response) => callback(response))
  ipcRenderer.send('get_ai_model_by_id', id)
}

/*
  ** ******** CREAR UN MODELO DE IA ********
*/
export function createAiModel(aiModel, callback) {
  ipcRenderer.removeAllListeners('create_ai_model')
  ipcRenderer.on('create_ai_model', (_, response) => callback(response))
  ipcRenderer.send('create_ai_model', aiModel)
}

/*
  ** ******** ACTUALIZAR UN MODELO DE IA ********
*/
export function updateAiModel(data, callback) {
  ipcRenderer.removeAllListeners('update_ai_model')
  ipcRenderer.on('update_ai_model', (_, response) => callback(response))
  ipcRenderer.send('update_ai_model', data)
}

/*
  ** ******** ELIMINAR UN MODELO DE IA ********
*/
export function deleteAiModel(id, callback) {
  ipcRenderer.removeAllListeners('delete_ai_model')
  ipcRenderer.on('delete_ai_model', (_, response) => callback(response))
  ipcRenderer.send('delete_ai_model', id)
}

/*
  ** ******** ACTUALIZAR ESTADO DE UN MODELO DE IA ********
*/
export function updateAiModelStatus(data, callback) {
  ipcRenderer.removeAllListeners('update_ai_model_status')
  ipcRenderer.on('update_ai_model_status', (_, response) => callback(response))
  ipcRenderer.send('update_ai_model_status', data)
}

/*
  ** ******** ESTABLECER MODELO DE IA POR DEFECTO ********
*/
export function setDefaultAiModel(data, callback) {
  ipcRenderer.removeAllListeners('set_default_ai_model')
  ipcRenderer.on('set_default_ai_model', (_, response) => callback(response))
  ipcRenderer.send('set_default_ai_model', data)
}

