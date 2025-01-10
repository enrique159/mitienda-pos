const { ipcRenderer } = require('electron')

exports.getBranchInfo = function (callback) {
  ipcRenderer.removeAllListeners('get_branch_info')
  ipcRenderer.on('get_branch_info', (_, response) => callback(response))
  ipcRenderer.send('get_branch_info')
}