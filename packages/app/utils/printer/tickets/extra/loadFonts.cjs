const path = require('path')
const fs = require('fs')
const mime = require('mime-types')
const { app } = require('electron')


module.exports.getFontFaceCSS = async () => {
  // Función para convertir un archivo a Data URL
  const fileToDataUrl = (filePath) => {
    try {
      const fontData = fs.readFileSync(filePath)
      const mimeType = mime.lookup(filePath) || 'application/octet-stream'
      const base64 = fontData.toString('base64')
      return `data:${mimeType};base64,${base64}`
    } catch (error) {
      console.error('Error al cargar la fuente:', error)
      return ''
    }
  }

  // Obtener las rutas a los archivos de fuentes
  // const fontDir = path.join(__dirname, '../fonts')
  const fontDir = path.resolve(
    app.getAppPath().replace('app.asar', ''),
    'resources',
    'fonts'
  )
  const regularPath = path.join(fontDir, 'BarlowSemiCondensed-Regular.ttf')
  const semiBoldPath = path.join(fontDir, 'BarlowSemiCondensed-SemiBold.ttf')
  const boldPath = path.join(fontDir, 'BarlowSemiCondensed-Bold.ttf')
  const blackPath = path.join(fontDir, 'BarlowSemiCondensed-Black.ttf')

  // Convertir las fuentes a Data URLs
  const regularFont = fileToDataUrl(regularPath)
  const semiBoldFont = fileToDataUrl(semiBoldPath)
  const boldFont = fileToDataUrl(boldPath)
  const blackFont = fileToDataUrl(blackPath)

  return `
      @font-face {
        font-family: 'Barlow Semi Condensed';
        src: url('${regularFont}') format('truetype');
        font-weight: 400;
        font-style: normal;
        font-display: swap;
      }

      @font-face {
        font-family: 'Barlow Semi Condensed';
        src: url('${semiBoldFont}') format('truetype');
        font-weight: 600;
        font-style: normal;
        font-display: swap;
      }

      @font-face {
        font-family: 'Barlow Semi Condensed';
        src: url('${boldFont}') format('truetype');
        font-weight: 700;
        font-style: normal;
        font-display: swap;
      }

      @font-face {
        font-family: 'Barlow Semi Condensed';
        src: url('${blackFont}') format('truetype');
        font-weight: 900;
        font-style: normal;
        font-display: swap;
      }
    `
}
