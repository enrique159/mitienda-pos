import { ipcRenderer } from 'electron'

export function getBranchInfo(callback) {
  ipcRenderer.removeAllListeners('get_branch_info')
  ipcRenderer.on('get_branch_info', (_, response) => callback(response))
  ipcRenderer.send('get_branch_info')
}

export function setBranchLogo(setDefaultLogo, callback) {
  ipcRenderer.removeAllListeners('set_branch_logo')
  ipcRenderer.on('set_branch_logo', (_, response) => callback(response))
  ipcRenderer.send('set_branch_logo', setDefaultLogo)
}

export function getBranchesByEmail(email, callback) {
  ipcRenderer.removeAllListeners('get_branches_by_email')
  ipcRenderer.on('get_branches_by_email', (_, response) => callback(response))
  ipcRenderer.send('get_branches_by_email', email)
}
