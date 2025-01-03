const { ipcRenderer } = require('electron')

exports.startSession = function (params, callback) {
  ipcRenderer.removeAllListeners('start_session')
  ipcRenderer.on('start_session', (_, response) => callback(response))
  ipcRenderer.send('start_session', params)
}

exports.getUsers = function (callback) {
  ipcRenderer.removeAllListeners('get_users')
  ipcRenderer.on('get_users', (_, response) => callback(response))
  ipcRenderer.send('get_users')
}
