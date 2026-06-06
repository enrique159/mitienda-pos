import { ipcRenderer } from 'electron'

export function getCategories(callback) {
  ipcRenderer.removeAllListeners('get_categories')
  ipcRenderer.on('get_categories', (_, response) => callback(response))
  ipcRenderer.send('get_categories')
}

export function createCategory(category, callback) {
  ipcRenderer.removeAllListeners('create_category')
  ipcRenderer.on('create_category', (_, response) => callback(response))
  ipcRenderer.send('create_category', category)
}

export function updateCategory(category, callback) {
  ipcRenderer.removeAllListeners('update_category')
  ipcRenderer.on('update_category', (_, response) => callback(response))
  ipcRenderer.send('update_category', category)
}

export function deleteCategory(id, callback) {
  ipcRenderer.removeAllListeners('delete_category')
  ipcRenderer.on('delete_category', (_, response) => callback(response))
  ipcRenderer.send('delete_category', id)
}
