const { ipcRenderer } = require('electron')

exports.createProvider = function (provider, callback) {
  ipcRenderer.removeAllListeners('create_provider')
  ipcRenderer.on('create_provider', (_, response) => callback(response))
  ipcRenderer.send('create_provider', provider)
}

exports.updateProvider = function (id, data, callback) {
  ipcRenderer.removeAllListeners('update_provider')
  ipcRenderer.on('update_provider', (_, response) => callback(response))
  ipcRenderer.send('update_provider', id, data)
}

exports.deleteProvider = function (id, callback) {
  ipcRenderer.removeAllListeners('delete_provider')
  ipcRenderer.on('delete_provider', (_, response) => callback(response))
  ipcRenderer.send('delete_provider', id)
}

exports.getProviders = function (callback) {
  ipcRenderer.removeAllListeners('get_providers')
  ipcRenderer.on('get_providers', (_, response) => callback(response))
  ipcRenderer.send('get_providers')
}

exports.getProviderById = function (id, callback) {
  ipcRenderer.removeAllListeners('get_provider_by_id')
  ipcRenderer.on('get_provider_by_id', (_, response) => callback(response))
  ipcRenderer.send('get_provider_by_id', id)
}
