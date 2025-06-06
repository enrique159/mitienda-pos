const { ipcMain } = require('electron')
const branchesRepository = require('./branchesRepository.cjs')
const { selectFile, saveFile } = require('../../helpers/index.cjs')

ipcMain.on('get_branch_info', async (event) => {
  const response = await branchesRepository.getBranchInfo()
  event.reply('get_branch_info', response)
})

ipcMain.on('set_branch_logo', async (event, setDefaultLogo) => {
  if (setDefaultLogo) {
    const response = await branchesRepository.setBranchLogo(null)
    event.reply('set_branch_logo', response)
    return
  }

  const selectedFile = await selectFile()
  if (!selectedFile.success) {
    event.reply('set_branch_logo', selectedFile)
    return
  }
  const { path } = selectedFile.response
  if (!path) {
    event.reply('set_branch_logo', { success: false, message: 'No se seleccionó ningún archivo', response: null })
    return
  }
  const mimeType = path.split('.').pop()
  const saveResponse = await saveFile('images', path, `logo.${mimeType}`)
  if (!saveResponse.success) {
    event.reply('set_branch_logo', saveResponse)
    return
  }
  const imagePath = saveResponse?.response?.split('images/').pop()
  const updateResponse = await branchesRepository.setBranchLogo(imagePath)
  event.reply('set_branch_logo', updateResponse)
})
