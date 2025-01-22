const { ipcRenderer } = require('electron')

exports.getCustomers = () => ipcRenderer.sendSync('get_customers')