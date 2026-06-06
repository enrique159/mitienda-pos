declare module 'qrcode' {
  export interface QRCodeToDataURLOptions {
    width?: number
    errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H'
    margin?: number
  }

  const QRCode: {
    toDataURL(text: string, options?: QRCodeToDataURLOptions): Promise<string>
  }

  export default QRCode
}

