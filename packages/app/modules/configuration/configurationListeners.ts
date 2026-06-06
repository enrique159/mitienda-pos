import { ipcRenderer } from 'electron'

export function initialConfiguration(payload, callback) {
  ipcRenderer.removeAllListeners('initial_configuration')
  ipcRenderer.on('initial_configuration', (_, response) => callback(response))
  ipcRenderer.send('initial_configuration', payload)
}

export function getConfiguration(callback) {
  ipcRenderer.removeAllListeners('get_configuration')
  ipcRenderer.on('get_configuration', (_, response) => callback(response))
  ipcRenderer.send('get_configuration')
}

export function getVersion(callback) {
  ipcRenderer.removeAllListeners('get_version')
  ipcRenderer.on('get_version', (_, response) => callback(response))
  ipcRenderer.send('get_version')
}

export function setDefaultPrinter(printerName, callback) {
  ipcRenderer.removeAllListeners('set_default_printer')
  ipcRenderer.on('set_default_printer', (_, response) => callback(response))
  ipcRenderer.send('set_default_printer', printerName)
}
