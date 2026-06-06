import { ipcRenderer } from 'electron'

export const getTaxes = () => ipcRenderer.sendSync('get_taxes')

export function createTax(params, callback) {
  ipcRenderer.removeAllListeners('create_tax')
  ipcRenderer.on('create_tax', (_, response) => callback(response))
  ipcRenderer.send('create_tax', params)
}

export function deleteTax(id, callback) {
  ipcRenderer.removeAllListeners('delete_tax')
  ipcRenderer.on('delete_tax', (_, response) => callback(response))
  ipcRenderer.send('delete_tax', id)
}
