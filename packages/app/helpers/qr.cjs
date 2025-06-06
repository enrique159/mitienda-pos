const QRCode = require('qrcode')

exports.generateQRCode = async (text, options = { width: 150, errorCorrectionLevel: 'L', margin: 1 }) => {
  return await QRCode.toDataURL(text, options)
}