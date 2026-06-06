// @ts-nocheck
const { ipcRenderer } = require('electron')

exports.clearDatabase = function (payload, callback) {
  ipcRenderer.removeAllListeners('clear_database')
  ipcRenderer.on('clear_database', (_, response) => callback(response))
  ipcRenderer.send('clear_database', payload)
}
export {}
