const { ipcMain } = require('electron')
const customersRepository = require('./customersRepository.cjs')

ipcMain.on("get_customers", async(event) => {
  const response = await customersRepository.getCustomers()
  event.returnValue = response
})

ipcMain.on("create_customer", async(event, data) => {
  const response = await customersRepository.createCustomer(data)
  event.reply("create_customer", response)
})

ipcMain.on("update_customer", async(event, data) => {
  const response = await customersRepository.updateCustomer(data)
  event.reply("update_customer", response)
})

ipcMain.on("delete_customer", async(event, customerId) => {
  const response = await customersRepository.deleteCustomer(customerId)
  event.reply("delete_customer", response)
})