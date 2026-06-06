import path from 'path'
import fs from 'fs'
import mime from 'mime-types'
import { app } from 'electron'
import logger from '../../../helpers/logger.js'


export const getImageDataUrl = (imageFileName: string): string => {
  const fileToDataUrl = (filePath: string): string => {
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
