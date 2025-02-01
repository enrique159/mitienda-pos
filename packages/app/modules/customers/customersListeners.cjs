
const { ipcRenderer } = require('electron')

exports.getCustomers = () => ipcRenderer.sendSync('get_customers')

exports.createCustomer = function (data, callback) {
  ipcRenderer.removeAllListeners('create_customer')
  ipcRenderer.on('create_customer', (_, response) => callback(response))
  ipcRenderer.send('create_customer', data)
}

exports.updateCustomer = function (data, callback) {
  ipcRenderer.removeAllListeners('update_customer')
  ipcRenderer.on('update_customer', (_, response) => callback(response))
  ipcRenderer.send('update_customer', data)
}

exports.deleteCustomer = function (data, callback) {
  ipcRenderer.removeAllListeners('delete_customer')
  ipcRenderer.on('delete_customer', (_, response) => callback(response))
  ipcRenderer.send('delete_customer', data)
}