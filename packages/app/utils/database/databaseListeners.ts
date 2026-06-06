import { ipcRenderer } from 'electron'

export function clearDatabase(payload, callback) {
  ipcRenderer.removeAllListeners('clear_database')
  ipcRenderer.on('clear_database', (_, response) => callback(response))
  ipcRenderer.send('clear_database', payload)
}
