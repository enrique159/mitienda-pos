const { ipcRenderer } = require('electron')

exports.getCompany = function (callback) {
  ipcRenderer.removeAllListeners('get_company')
  ipcRenderer.on('get_company', (_, response) => callback(response))
  ipcRenderer.send('get_company')
}