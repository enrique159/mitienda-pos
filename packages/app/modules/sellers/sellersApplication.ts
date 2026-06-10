import { ipcMain } from 'electron'
import * as sellerRepository from './sellersRepository.js'

ipcMain.on('create_seller', async (event, seller) => {
  const response = await sellerRepository.createSeller(seller)
  event.reply('create_seller', response)
})

ipcMain.on('update_seller', async (event, seller) => {
  const response = await sellerRepository.updateSeller(seller)
  event.reply('update_seller', response)
})

ipcMain.on('delete_seller_by_id', async (event, sellerId) => {
  const response = await sellerRepository.deleteSellerById(sellerId)
  event.reply('delete_seller_by_id', response)
})

ipcMain.on('update_permissions_seller', async (event, params) => {
  const response = await sellerRepository.updatePermissionsSeller(params)
  event.reply('update_permissions_seller', response)
})

ipcMain.on('start_session', async (event, data) => {
  const response = await sellerRepository.startSession(data)
  event.reply('start_session', response)
})

ipcMain.on('close_session', async (event, sellerId) => {
  const response = await sellerRepository.closeSession(sellerId)
  event.returnValue = response
})

ipcMain.on('get_sellers', async (event) => {
  const response = await sellerRepository.getSellers()
  event.reply('get_sellers', response)
})

ipcMain.on('get_all_sellers', async (event) => {
  const response = await sellerRepository.getAllSellers()
  event.reply('get_all_sellers', response)
})

ipcMain.on('get_seller_by_id', async (event, sellerId) => {
  const response = await sellerRepository.getSellerById(sellerId)
  event.reply('get_seller_by_id', response)
})

ipcMain.on('get_pos_sellers', async (event) => {
  const response = await sellerRepository.getPosSellers()
  event.reply('get_pos_sellers', response)
})

