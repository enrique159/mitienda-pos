const { ipcRenderer } = require('electron')

exports.getBranchInfo = function (callback) {
  ipcRenderer.removeAllListeners('get_branch_info')
  ipcRenderer.on('get_branch_info', (_, response) => callback(response))
  ipcRenderer.send('get_branch_info')
}

exports.setBranchLogo = function (setDefaultLogo, callback) {
  ipcRenderer.removeAllListeners('set_branch_logo')
  ipcRenderer.on('set_branch_logo', (_, response) => callback(response))
  ipcRenderer.send('set_branch_logo', setDefaultLogo)
}