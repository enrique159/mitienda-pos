const { ipcMain } = require('electron')
const customersRepository = require('./customersRepository.cjs')

ipcMain.on("get_customers", async(event) => {
  const response = await customersRepository.getCustomers()
  event.returnValue = response
})
