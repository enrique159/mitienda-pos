const { ipcRenderer } = require('electron')

exports.startSession = function (params, callback) {
  ipcRenderer.removeAllListeners('start_session')
  ipcRenderer.on('start_session', (_, response) => callback(response))
  ipcRenderer.send('start_session', params)
}

exports.getSellers = function (callback) {
  ipcRenderer.removeAllListeners('get_sellers')
  ipcRenderer.on('get_sellers', (_, response) => callback(response))
  ipcRenderer.send('get_sellers')
}
