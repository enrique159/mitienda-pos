import { ipcRenderer } from 'electron'

export function createSeller(seller, callback) {
  ipcRenderer.removeAllListeners('create_seller')
  ipcRenderer.on('create_seller', (_, response) => callback(response))
  ipcRenderer.send('create_seller', seller)
}

export function updateSeller(seller, callback) {
  ipcRenderer.removeAllListeners('update_seller')
  ipcRenderer.on('update_seller', (_, response) => callback(response))
  ipcRenderer.send('update_seller', seller)
}

export function updatePermissionsSeller(params, callback) {
  ipcRenderer.removeAllListeners('update_permissions_seller')
  ipcRenderer.on('update_permissions_seller', (_, response) =>
    callback(response)
  )
  ipcRenderer.send('update_permissions_seller', params)
}

export function deleteSellerById(sellerId, callback) {
  ipcRenderer.removeAllListeners('delete_seller_by_id')
  ipcRenderer.on('delete_seller_by_id', (_, response) => callback(response))
  ipcRenderer.send('delete_seller_by_id', sellerId)
}

export function startSession(params, callback) {
  ipcRenderer.removeAllListeners('start_session')
  ipcRenderer.on('start_session', (_, response) => callback(response))
  ipcRenderer.send('start_session', params)
}

export const closeSession = (sellerId) =>
  ipcRenderer.sendSync('close_session', sellerId)

export function getSellers(callback) {
  ipcRenderer.removeAllListeners('get_sellers')
  ipcRenderer.on('get_sellers', (_, response) => callback(response))
  ipcRenderer.send('get_sellers')
}

export function getPosSellers(callback) {
  ipcRenderer.removeAllListeners('get_pos_sellers')
  ipcRenderer.on('get_pos_sellers', (_, response) => callback(response))
  ipcRenderer.send('get_pos_sellers')
}

export function getAllSellers(callback) {
  ipcRenderer.removeAllListeners('get_all_sellers')
  ipcRenderer.on('get_all_sellers', (_, response) => callback(response))
  ipcRenderer.send('get_all_sellers')
}

export function getSellerById(sellerId, callback) {
  ipcRenderer.removeAllListeners('get_seller_by_id')
  ipcRenderer.on('get_seller_by_id', (_, response) => callback(response))
  ipcRenderer.send('get_seller_by_id', sellerId)
}
