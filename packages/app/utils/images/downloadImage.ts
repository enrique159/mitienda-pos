// @ts-nocheck
const { app } = require('electron')
const fs = require('fs')
const path = require('path')
const https = require('https')
const http = require('http')
const { response } = require('../../helpers/index.cjs')

exports.downloadImage = (url) => {
  return new Promise((resolve) => {
    try {
      // Extraer el nombre del archivo del URL
      const urlParts = url.split('/')
      const filename = urlParts[urlParts.length - 1]
      
      if (!filename) {
        return resolve(response(false, 'No se pudo extraer el nombre del archivo del URL', null))
      }
      
      // Definir la ruta de destino
      const imagesDir = path.resolve(
        app.getAppPath().replace('app.asar', ''),
        'resources',
        'images'
      )
      const filePath = path.resolve(imagesDir, filename)
      
      // Crear el directorio si no existe
      if (!fs.existsSync(imagesDir)) {
        fs.mkdirSync(imagesDir, { recursive: true })
      }
      
      // Determinar el protocolo (http o https)
      const protocol = url.startsWith('https') ? https : http
      
      // Descargar la imagen
      const file = fs.createWriteStream(filePath)
      
      protocol.get(url, (fetchResponse) => {
        if (fetchResponse.statusCode !== 200) {
          fs.unlinkSync(filePath)
          return resolve(response(false, 'Error al descargar la imagen', `Error al descargar la imagen: ${fetchResponse.statusCode}`))
        }
        
        fetchResponse.pipe(file)
        
        file.on('finish', () => {
          file.close()
          resolve(response(true, 'Imagen descargada', { filePath, filename }))
        })
      }).on('error', (err) => {
        fs.unlinkSync(filePath)
        resolve(response(false, 'Error al descargar la imagen', err))
      })
      
      file.on('error', (err) => {
        fs.unlinkSync(filePath)
        resolve(response(false, 'Error al descargar la imagen', err))
      })
    } catch (error) {
      resolve(response(false, 'Error al descargar la imagen', error))
    }
  })
}

export {}
