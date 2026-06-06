// @ts-nocheck
const { ipcRenderer } = require('electron')

exports.getPosCompany = function (callback) {
  ipcRenderer.removeAllListeners('get_pos_company')
  ipcRenderer.on('get_pos_company', (_, response) => callback(response))
  ipcRenderer.send('get_pos_company')
}

exports.getCompany = function (callback) {
  ipcRenderer.removeAllListeners('get_company')
  ipcRenderer.on('get_company', (_, response) => callback(response))
  ipcRenderer.send('get_company')
}
export {}
