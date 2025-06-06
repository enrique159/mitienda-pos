const { app, dialog } = require('electron')
const logger = require('./logger.cjs')
const path = require('path')
const fs = require('fs')
const sharp = require('sharp')

exports.saveFile = (bucket, sourcePath, name) => {
  try {
    const basePath = path.resolve(
      app.getAppPath().replace('app.asar', ''),
      'resources',
      bucket
    )
    const destinationPath = path.resolve(basePath, name)

    // Verificar si el directorio existe, si no, crearlo
    if (!fs.existsSync(basePath)) {
      fs.mkdirSync(basePath, { recursive: true })
    }

    // Leer el archivo fuente
    const fileData = fs.readFileSync(sourcePath)

    // Escribir el archivo en el destino
    fs.writeFileSync(destinationPath, fileData)

    return { success: true, message: 'Archivo guardado', response: destinationPath }
  } catch (error) {
    logger.error({ type: 'SAVE FILE ERROR', message: error.message, data: error })
    return { success: false, message: 'Error al guardar el archivo', response: error.message }
  }
}

exports.selectFile = async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [{ name: 'Imágenes', extensions: ['jpg', 'png'] }],
    title: 'Seleccionar imagen',
    buttonLabel: 'Seleccionar',
    message: 'Seleccione una imagen (JPG o PNG, máx. 1MB, máx. 3000x3000px)',
  })

  if (canceled || filePaths.length === 0) {
    return { success: false, message: 'No se seleccionó ningún archivo', response: null }
  }

  const filePath = filePaths[0]

  const image = await sharp(filePath)
    .metadata()
    .catch((err) => {
      logger.error({ type: 'SELECT FILE ERROR', message: err.message, data: err })
      return false
    })

  if (!image) {
    return { success: false, message: 'Error al leer el archivo', response: null }
  }

  if (image.width > 1024 || image.height > 1024) {
    return { success: false, message: 'La imagen debe tener un tamaño máximo de 1024x1024px', response: null }
  }

  if (image.size > 2 * 1024 * 1024) {
    return { success: false, message: 'La imagen debe tener un tamaño máximo de 2MB', response: null }
  }

  try {
    const fileContent = fs.readFileSync(filePath, 'binary')
    return { success: true, message: 'Archivo seleccionado', response: { path: filePath, content: fileContent } }
  } catch (err) {
    return { success: false, message: 'Error al leer el archivo', response: err }
  }
}
