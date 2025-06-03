const { ipcRenderer } = require('electron')

exports.getConfiguration = function (callback) {
  ipcRenderer.removeAllListeners('get_configuration')
  ipcRenderer.on('get_configuration', (_, response) => callback(response))
  ipcRenderer.send('get_configuration')
}

exports.getVersion = function (callback) {
  ipcRenderer.removeAllListeners('get_version')
  ipcRenderer.on('get_version', (_, response) => callback(response))
  ipcRenderer.send('get_version')
}

exports.setDefaultPrinter = function (printerName, callback) {
  ipcRenderer.removeAllListeners('set_default_printer')
  ipcRenderer.on('set_default_printer', (_, response) => callback(response))
  ipcRenderer.send('set_default_printer', printerName)
}