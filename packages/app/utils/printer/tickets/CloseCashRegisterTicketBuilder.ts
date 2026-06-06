import logger from '../../../helpers/logger.js'
import { getFontFaceCSS, fontName } from '../extra/loadFonts.js'
import { getImageDataUrl } from '../extra/loadImage.js'
import { ticketDateFormatter, ticketDateFormatterTimezone, getToday } from '../../../helpers/datetime.js'
import { getSellerById } from '../../../modules/sellers/sellersRepository.js'

type AnyRecord = Record<string, any>

export default class CloseCashRegisterTicketBuilder {
  ticket = ''
  logoPath = ''
  businessInfo: AnyRecord = {}
  ticketInfo: AnyRecord = {}
  items: AnyRecord[] = []
  totals: AnyRecord[] = []

  constructor({
    businessInfo = {
      businessName: '', // Nombre del negocio
      branchInfo: '', // Nombre de la sucursal
      branchTimezone: 'America/Mexico_City', // Timezone de la sucursal
      posAlias: '', // Alias del POS
      date: new Date(), // Fecha de cierre
      logo: null,
    },

    ticketInfo = {
      openedBy: '', // Cajero que abrió la caja
      closedBy: '', // Cajero que cerró la caja
      openedAt: null, // Fecha de apertura
      closedAt: null, // Fecha de cierre
      type: 'partial', // Cierre parcial o completo
    },

    items = [],
    totals = [],
  }) {
    this.businessInfo = businessInfo
    this.ticketInfo = ticketInfo
    this.items = items
    this.totals = totals
  }


  async setLogoPath() {
    this.logoPath = await getImageDataUrl(this.businessInfo.logo || 'default.jpg')
    if (!this.logoPath) this.logoPath = await getImageDataUrl('default.jpg')
  }

  async getSellerOpener() {
    try {
      const sellerOpened = await getSellerById(this.ticketInfo.openedBy)
      if (!sellerOpened.success) {
        logger.error({ type: 'BUILD TICKET INFO', message: 'Vendedor no encontrado', data: { seller_id: this.ticketInfo.openedBy } })
        this.ticketInfo.openedBy = 'Anónimo'
      } else {
        this.ticketInfo.openedBy = sellerOpened.response.name
      }
    } catch (error) {
      logger.error({ type: 'GET SELLER OPENER', message: `${error}`, data: error })
      this.ticketInfo.openedBy = 'Anónimo'
    }
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
        <h3 style="margin: 5px 0; text-transform: uppercase;">${this.businessInfo.businessName}</h3>
        <p style="margin: 2px 0; text-transform: uppercase;">${this.businessInfo.branchInfo}</p>
        <p style="margin: 2px 0; text-transform: uppercase;">CAJA: ${this.businessInfo.posAlias}</p>
        <p style="margin: 2px 0;">${ticketDateFormatter(this.businessInfo.date)}</p>
        <hr>
      </div>
    `
    return this
  }

  buildTicketInfo() {
    this.ticket += `
      <div class="ticket-info">
        <div style="display: flex; justify-content: space-between; font-size: 10px;">
          <p style="margin: 0;">Abierto por</p>
          <p style="margin: 0;">Abierto a las</p>
        </div>
        <div style="display: flex; justify-content: space-between;">
          <p style="margin: 0;">${this.ticketInfo.openedBy}</p>
          <p style="margin: 0;">${ticketDateFormatterTimezone(this.ticketInfo.openedAt, this.businessInfo.branchTimezone)}</p>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 10px;">
          <p style="margin: 0;">Cerrado por</p>
          <p style="margin: 0;">Cerrado a las</p>
        </div>
        <div style="display: flex; justify-content: space-between;">
          <p style="margin: 0;">${this.ticketInfo.closedBy}</p>
          <p style="margin: 0;">${ticketDateFormatter(this.ticketInfo.closedAt)}</p>
        </div>
        <hr>
      </div>
    `
    return this
  }

  buildItems() {
    this.ticket += `
      <table id="table">
        <tbody id="table-body">
    `

    this.items.forEach((item) => {
      this.ticket += `
        <tr>
          <td>${item.name}</td>
          <td class="right">${item.symbol ? item.symbol + ' ' : ''}${item.value}</td>
        </tr>
      `
    })

    this.totals.forEach((total) => {
      this.ticket += `
        <tr style="font-weight: bold;">
          <td style="font-size: 12px;">${total.name}</td>
          <td class="right" style="font-size: 12px;">${total.symbol ? total.symbol + ' ' : ''}${total.value}</td>
        </tr>
      `
    })

    this.ticket += `
        </tbody>
      </table>
      <hr>
    `
    return this
  }

  buildSignSection() {
    this.ticket += `
      <div class="sign-section" style="margin-top: 20px; text-align: center;">
        <p style="margin-bottom: 10px; font-size: 11px;">Firma de quien realiza el corte</p>
        <div style="border: 1px solid #000; width: 200px; height: 60px; margin: 10px auto;"></div>
        <p style="margin-top: 5px; font-size: 10px;">${this.ticketInfo.closedBy}</p>
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
          size: 80mm auto;
        }
        body {
          margin: 0;
          padding: 0;
          font-family: '${fontName}', monospace;
          font-size: 14px;
          width: 80mm;
        }
        hr {
          border-top: 1px dashed black;
          margin: 5px 0;
        }
        .container {
          width: 72mm;
          padding: 0 4mm;
          padding-top: 4mm;
        }
        .center {
          text-align: center;
        }
        .logo {
          display: flex;
          justify-content: center;
          margin-bottom: 10px;
        }
        .logo img {
          max-width: 200px;
          max-height: 80px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
        }
        table th {
          padding: 0.5rem 0;
          border-top: 1px dashed black;
          border-bottom: 1px dashed black;
          font-size: 11px;
        }
        table td {
          padding-right: 0.5rem;
          padding-top: .1rem;
          padding-bottom: .1rem;
          vertical-align: top;
          max-width: 30mm;
          font-size: 11px;
        }
        #client_table td {
          font-size: 14px;
        }
        .left {
          text-align: left;
        }
        .right {
          text-align: right;
        }
        .qr {
          display: flex;
          justify-content: center;
          padding: 1rem 0;
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
    return `CLOSE-CASH-${this.businessInfo.posAlias}-${todayString}-${timestamp}`
  }

  async generateTicket() {
    await this.setLogoPath()
    await this.getSellerOpener()

    this.buildHeader()
      .buildTicketInfo()
      .buildItems()
      .buildSignSection()

    return await this.build()
  }
}
