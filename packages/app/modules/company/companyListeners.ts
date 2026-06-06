import { ipcRenderer } from 'electron'

export function getPosCompany(callback) {
  ipcRenderer.removeAllListeners('get_pos_company')
  ipcRenderer.on('get_pos_company', (_, response) => callback(response))
  ipcRenderer.send('get_pos_company')
}

export function getCompany(callback) {
  ipcRenderer.removeAllListeners('get_company')
  ipcRenderer.on('get_company', (_, response) => callback(response))
  ipcRenderer.send('get_company')
}
