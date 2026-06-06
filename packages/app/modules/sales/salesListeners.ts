import { ipcRenderer } from 'electron'


export function createSale(data, callback) {
  ipcRenderer.removeAllListeners('create_sale')
  ipcRenderer.on('create_sale', (_, response) => callback(response))
  ipcRenderer.send('create_sale', data)
}

export function getSales(callback) {
  ipcRenderer.removeAllListeners('get_sales')
  ipcRenderer.on('get_sales', (_, response) => callback(response))
  ipcRenderer.send('get_sales')
}

export function getSalesInTurn(idCashRegister, callback) {
  ipcRenderer.removeAllListeners('get_sales_in_turn')
  ipcRenderer.on('get_sales_in_turn', (_, response) => callback(response))
  ipcRenderer.send('get_sales_in_turn', idCashRegister)
}

export const generateSaleFolio = () => ipcRenderer.sendSync('generate_sale_folio')
