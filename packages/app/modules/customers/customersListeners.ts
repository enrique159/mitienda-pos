
import { ipcRenderer } from 'electron'

export const getCustomers = () => ipcRenderer.sendSync('get_customers')

export function createCustomer(data, callback) {
  ipcRenderer.removeAllListeners('create_customer')
  ipcRenderer.on('create_customer', (_, response) => callback(response))
  ipcRenderer.send('create_customer', data)
}

export function updateCustomer(data, callback) {
  ipcRenderer.removeAllListeners('update_customer')
  ipcRenderer.on('update_customer', (_, response) => callback(response))
  ipcRenderer.send('update_customer', data)
}

export function deleteCustomer(data, callback) {
  ipcRenderer.removeAllListeners('delete_customer')
  ipcRenderer.on('delete_customer', (_, response) => callback(response))
  ipcRenderer.send('delete_customer', data)
}
