const logger = require('../../../helpers/logger.cjs')
const { getFontFaceCSS, fontName } = require('../extra/loadFonts.cjs')
const { getImageDataUrl } = require('../extra/loadImage.cjs')
const {
  ticketDateFormatter,
  ticketDateFormatterTimezone,
  getToday,
} = require('../../../helpers/datetime.cjs')
const {
  getSellerById,
} = require('../../../modules/sellers/sellersRepository.cjs')

module.exports = class CloseCashRegisterTicketBuilder {
  ticket = ''
  logoPath = ''
  branchInfo = {}
  cashRegisterInfo = {}

  constructor(payload) {
    this.logoPath = payload.branch.logo
    this.branchInfo = payload.branch
    this.cashRegisterInfo = payload.cashRegister
    console.log(payload)
  }

  async setLogoPath() {
    this.logoPath = await getImageDataUrl(this.logoPath || 'default.jpg')
    if (!this.logoPath) this.logoPath = await getImageDataUrl('default.jpg')
  }

  buildHeader() {
    const logoHtml = this.logoPath
      ? `<div class="logo">
          <img src="${this.logoPath}" alt="Logo">
        </div>`
      : ''

    this.ticket += `
      <div class="header center">
        ${logoHtml}
      </div>
    `
    return this
  }

  async build() {
    // Cargar las fuentes primero
    const fontFaceCSS = await getFontFaceCSS()

    const style = `
      <style>
        @page {
          margin: 0;
          size: 215.9mm auto;
        }
        body {
          margin: 0;
          padding: 1rem;
          font-family: '${fontName}', monospace;
          font-size: 14px;
          width: 100%;
        }
      </style>
    `

    return `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <title>Ticket de Venta</title>
        <style>
          ${fontFaceCSS}
        </style>
        ${style}
      </head>
      <body>
        <div class="container">
          ${this.ticket}
        </div>
      </body>
      </html>
    `
  }

  getTicketName() {
    const todayString = getToday()
    const timestamp = Math.floor((Date.now() / 1000) % 1000000)
    return `CLOSE-CASH-REPORT-${todayString}-${timestamp}`
  }

  async generateTicket() {
    await this.setLogoPath()
    this.buildHeader()
    return await this.build()
  }
}
