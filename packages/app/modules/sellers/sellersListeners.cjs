const { ipcRenderer } = require('electron')

exports.createSeller = function (seller, callback) {
  ipcRenderer.removeAllListeners('create_seller')
  ipcRenderer.on('create_seller', (_, response) => callback(response))
  ipcRenderer.send('create_seller', seller)
}

exports.startSession = function (params, callback) {
  ipcRenderer.removeAllListeners('start_session')
  ipcRenderer.on('start_session', (_, response) => callback(response))
  ipcRenderer.send('start_session', params)
}

exports.closeSession = (sellerId) => ipcRenderer.sendSync('close_session', sellerId)

exports.getSellers = function (callback) {
  ipcRenderer.removeAllListeners('get_sellers')
  ipcRenderer.on('get_sellers', (_, response) => callback(response))
  ipcRenderer.send('get_sellers')
}

exports.getPosSellers = function (callback) {
  ipcRenderer.removeAllListeners('get_pos_sellers')
  ipcRenderer.on('get_pos_sellers', (_, response) => callback(response))
  ipcRenderer.send('get_pos_sellers')
}

exports.getAllSellers = function (callback) {
  ipcRenderer.removeAllListeners('get_all_sellers')
  ipcRenderer.on('get_all_sellers', (_, response) => callback(response))
  ipcRenderer.send('get_all_sellers')
}