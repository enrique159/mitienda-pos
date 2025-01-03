const { ipcRenderer } = require('electron')

exports.getConfiguration = function (callback) {
  ipcRenderer.removeAllListeners('get_configuration')
  ipcRenderer.on('get_configuration', (_, response) => callback(response))
  ipcRenderer.send('get_configuration')
}

exports.updateConfiguration = function (data, callback) {
  ipcRenderer.removeAllListeners('update_configuration')
  ipcRenderer.on('update_configuration', (_, response) => callback(response))
  ipcRenderer.send('update_configuration', data)
}

exports.createConfiguration = function (data, callback) {
  ipcRenderer.removeAllListeners('create_configuration')
  ipcRenderer.on('create_configuration', (_, response) => callback(response))
  ipcRenderer.send('create_configuration', data)
}

exports.exportDatabase = function (callback) {
  ipcRenderer.removeAllListeners('export_database')
  ipcRenderer.on('export_database', (_, response) => callback(response))
  ipcRenderer.send('export_database')
}

exports.importDatabase = function (data, callback) {
  ipcRenderer.removeAllListeners('import_database')
  ipcRenderer.on('import_database', (_, response) => callback(response))
  ipcRenderer.send('import_database', data)
}

exports.getVersion = function (callback) {
  ipcRenderer.removeAllListeners('get_version')
  ipcRenderer.on('get_version', (_, response) => callback(response))
  ipcRenderer.send('get_version')
}