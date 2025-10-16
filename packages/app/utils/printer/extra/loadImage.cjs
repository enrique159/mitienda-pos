const path = require('path')
const fs = require('fs')
const mime = require('mime-types')
const { app } = require('electron')
const logger = require('../../../helpers/logger.cjs')


module.exports.getImageDataUrl = (imageFileName) => {
  const fileToDataUrl = (filePath) => {
    try {
      const imageFileData = fs.readFileSync(filePath)
      const mimeType = mime.lookup(filePath) || 'application/octet-stream'
      const base64 = imageFileData.toString('base64')
      return `data:${mimeType};base64,${base64}`
    } catch (error) {
      logger.error({ type: 'GET IMAGE DATA URL', message: 'Error al cargar la imagen', data: error })
      return ''
    }
  }

  const imagesResourcesDir = path.resolve(
    app.getAppPath().replace('app.asar', ''),
    'resources',
    'images'
  )
  const imagePath = path.join(imagesResourcesDir, imageFileName)

  return fileToDataUrl(imagePath)
}
