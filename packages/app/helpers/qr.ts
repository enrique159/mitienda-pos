import QRCode, { type QRCodeToDataURLOptions } from 'qrcode'

export const generateQRCode = async (
  text: string,
  options: QRCodeToDataURLOptions = { width: 150, errorCorrectionLevel: 'L', margin: 1 }
): Promise<string> => {
  return await QRCode.toDataURL(text, options)
}

