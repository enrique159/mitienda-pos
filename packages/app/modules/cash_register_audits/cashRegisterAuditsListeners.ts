import { ipcRenderer } from 'electron'

export function createCashRegisterAudit(data, callback) {
  ipcRenderer.removeAllListeners('create_cash_register_audit')
  ipcRenderer.on('create_cash_register_audit', (_, response) => callback(response))
  ipcRenderer.send('create_cash_register_audit', data)
}

export const getCashRegisterAudits = () => ipcRenderer.sendSync('get_cash_register_audits')

