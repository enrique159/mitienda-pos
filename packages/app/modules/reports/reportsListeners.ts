import { ipcRenderer } from 'electron'

export function getReports(filters, callback) {
  ipcRenderer.removeAllListeners('get_reports')
  ipcRenderer.on('get_reports', (_, response) => callback(response))
  ipcRenderer.send('get_reports', filters)
}
