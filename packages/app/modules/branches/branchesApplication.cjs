const { ipcMain } = require('electron')
const { getBranchInfo } = require('./branchesRepository.cjs')

ipcMain.on('get_branch_info', async (event) => {
  const response = await getBranchInfo()
  event.reply('get_branch_info', response)
})
