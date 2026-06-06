import { ipcRenderer } from 'electron'

export const getCashRegisterActive = () => ipcRenderer.sendSync('get_cash_register_active')

export function createCashRegister(data, callback) {
  ipcRenderer.removeAllListeners('create_cash_register')
  ipcRenderer.on('create_cash_register', (_, response) => callback(response))
  ipcRenderer.send('create_cash_register', data)
}

export const getCurrentCashRegisterState = () => ipcRenderer.sendSync('get_current_cash_register_state')
