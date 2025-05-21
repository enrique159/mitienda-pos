const { ipcRenderer } = require('electron')

/*
  ** ******** OBTENER TODOS LOS MODELOS DE IA ********
*/
exports.getAiModels = function (callback) {
  ipcRenderer.removeAllListeners('get_ai_models')
  ipcRenderer.on('get_ai_models', (_, response) => callback(response))
  ipcRenderer.send('get_ai_models')
}

/*
  ** ******** OBTENER MODELO DE IA POR ID ********
*/
exports.getAiModelById = function (id, callback) {
  ipcRenderer.removeAllListeners('get_ai_model_by_id')
  ipcRenderer.on('get_ai_model_by_id', (_, response) => callback(response))
  ipcRenderer.send('get_ai_model_by_id', id)
}

/*
  ** ******** CREAR UN MODELO DE IA ********
*/
exports.createAiModel = function (aiModel, callback) {
  ipcRenderer.removeAllListeners('create_ai_model')
  ipcRenderer.on('create_ai_model', (_, response) => callback(response))
  ipcRenderer.send('create_ai_model', aiModel)
}

/*
  ** ******** ACTUALIZAR UN MODELO DE IA ********
*/
exports.updateAiModel = function (data, callback) {
  ipcRenderer.removeAllListeners('update_ai_model')
  ipcRenderer.on('update_ai_model', (_, response) => callback(response))
  ipcRenderer.send('update_ai_model', data)
}

/*
  ** ******** ELIMINAR UN MODELO DE IA ********
*/
exports.deleteAiModel = function (id, callback) {
  ipcRenderer.removeAllListeners('delete_ai_model')
  ipcRenderer.on('delete_ai_model', (_, response) => callback(response))
  ipcRenderer.send('delete_ai_model', id)
}

/*
  ** ******** ACTUALIZAR ESTADO DE UN MODELO DE IA ********
*/
exports.updateAiModelStatus = function (data, callback) {
  ipcRenderer.removeAllListeners('update_ai_model_status')
  ipcRenderer.on('update_ai_model_status', (_, response) => callback(response))
  ipcRenderer.send('update_ai_model_status', data)
}

/*
  ** ******** ESTABLECER MODELO DE IA POR DEFECTO ********
*/
exports.setDefaultAiModel = function (data, callback) {
  ipcRenderer.removeAllListeners('set_default_ai_model')
  ipcRenderer.on('set_default_ai_model', (_, response) => callback(response))
  ipcRenderer.send('set_default_ai_model', data)
}
