const { generateQRCode, logger } = require('../../../helpers/index.cjs')
const { getFontFaceCSS } = require('../extra/loadFonts.cjs')
const { getImageDataUrl } = require('../extra/loadImage.cjs')
const branchesRepository = require('../../../modules/branches/branchesRepository.cjs')
const { ToWords } = require('to-words')

const toWords = new ToWords({
  localeCode: 'es-MX',
  converterOptions: {
    currency: true,
    ignoreDecimal: false,
    ignoreZeroCurrency: false,
    doNotAddOnly: false,
    currencyOptions: {
      name: 'Peso',
      plural: 'Pesos',
      symbol: '$',
      fractionalUnit: {
        name: 'Centavo',
        plural: 'Centavos',
      },
    },
  },
})

const fontName = 'Roboto Condensed'

module.exports = class SaleTicketBuilder {
  businessInfo = {}
  ticketInfo = {}
  items = []
  paymentInfo = {}
  customerInfo = {}
  invoiceInfo = {}
  footerInfo = {}
  logoPath = ''

  constructor({
    businessInfo = {
      businessName: '',
      legalName: '',
      address: '',
      location: '',
      rfc: '',
      branchInfo: '',
    },

    ticketInfo = {
      ticketId: '',
      date: new Date(),
      cashier: '',
      attendedBy: '',
    },

    items = [],

    paymentInfo = {
      total: 0,
      tax: 0,
      paymentMethods: [],
      amountGiven: 0,
      change: 0,
    },

    customerInfo = null,

    invoiceInstructions = '',
    invoiceUrl = '',
    qrCode = '',

    thankYouMessage = 'Gracias por su compra',
    businessUrl = '',

    logoPath = '',
  }) {
    this.logoPath = logoPath
    this.businessInfo = businessInfo
    this.ticketInfo = ticketInfo
    this.items = items
    this.paymentInfo = paymentInfo
    this.customerInfo = customerInfo

    this.invoiceInfo = {
      invoiceInstructions,
      invoiceUrl,
      qrCode,
    }

    this.footerInfo = {
      thankYouMessage,
      businessUrl,
    }

    this.ticket = ''
  }

  async createQRCode() {
    const qrCode = await generateQRCode(this.invoiceInfo.invoiceUrl)
    this.invoiceInfo.qrCode = qrCode
  }

  async setLogoPath() {
    const response = await branchesRepository.getBranchInfo()
    if (!response.success) {
      logger.error({ type: 'GET BRANCH INFO IN SALE TICKET BUILDER', message: 'Error al traer la sucursal en la creación del ticket', data: response })
      this.logoPath = await getImageDataUrl('default.jpg')
      return
    }
    this.logoPath = await getImageDataUrl(response.response.logo || 'default.jpg')
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
        <p style="margin: 2px 0;">${this.businessInfo.legalName}</p>
        <p style="margin: 2px 0;">${this.businessInfo.address}</p>
        <p style="margin: 2px 0;">${this.businessInfo.location}</p>
        <p style="margin: 2px 0; text-transform: uppercase;">RFC: ${this.businessInfo.rfc}</p>
        <p style="margin: 2px 0; font-weight: 700;">SUCURSAL</p>
        <p style="margin: 2px 0; text-transform: uppercase;">${this.businessInfo.branchInfo}</p>
        <hr>
      </div>
    `
    return this
  }

  buildTicketInfo() {
    const formattedDate =
      this.ticketInfo.date instanceof Date
        ? this.ticketInfo.date.toLocaleString('es-MX', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        })
        : this.ticketInfo.date

    this.ticket += `
      <div class="ticket-info">
        <p style="margin: 2px 0; text-align: center;"><strong>Ticket de compra</strong></p>
        <div style="display: flex; justify-content: space-between;">
          <p style="margin: 0;">${this.ticketInfo.ticketId}</p>
          <p style="margin: 0;">${formattedDate}</p>
        </div>
        <div style="display: flex; justify-content: space-between;">
          <p style="margin: 0;">CAJA: ${this.ticketInfo.cashier}</p>
          <p style="margin: 0;">Atendido por: ${this.ticketInfo.attendedBy}</p>
        </div>
        <hr>
      </div>
    `
    return this
  }

  buildItems() {
    this.ticket += `
      <table id="table">
        <thead id="table-head">
          <tr>
            <th class="left" colspan="2">Producto</th>
            <th class="right">Precio</th>
            <th class="right">Subtotal</th>
          </tr>
        </thead>
        <tbody id="table-body">
    `

    this.items.forEach((item) => {
      const discount = item.discount
        ? `
        <tr>
          <td colspan="3" class="right">- ${
  item.discountLabel || 'Descuento'
}</td>
          <td class="right">-${item.discount}</td>
        </tr>
      `
        : ''

      this.ticket += `
        <tr>
          <td>${item.quantity}</td>
          <td>${item.name}</td>
          <td class="right">${item.price}</td>
          <td class="right">${item.subtotal}</td>
        </tr>
        ${discount}
      `
    })

    this.ticket += `
        </tbody>
      </table>
    `
    return this
  }

  buildTotal() {
    this.ticket += `
      <div class="total">
        <hr>
        <p style="margin: 2px 0; text-align: right; font-size: 18px; font-weight: 600;">Total: $ ${this.paymentInfo.total}</p>
        <p style="margin: 2px 0; font-size: 12px;">
          (${this.amountToWords(this.paymentInfo.total)} 00/100 M.N.)
        </p>
        <p style="margin: 2px 0; font-size: 12px;">Precios con IVA incluido</p>
        <div style="display: flex; justify-content: space-between;">
          <span style="margin: 2px 0; font-size: 12px;">IVA: $ ${this.paymentInfo.tax}</span>
          <div style="display: flex; flex-direction: column;">
            <span style="margin: 0;">Entregado: $ ${this.paymentInfo.amountGiven}</span>
            <span style="margin: 0;">Cambio: $ ${this.paymentInfo.change}</span>
          </div>
        </div>
      </div>
    `
    return this
  }

  buildPaymentInfo() {
    this.ticket += `
      <div class="payment-info">
        <hr>
        <p style="margin: 2px 0;"><strong>Métodos de pago</strong></p>
    `

    this.paymentInfo.paymentMethods.forEach((method) => {
      this.ticket += `
        <p style="margin: 2px 0;">${method.name}: $ ${method.amount}</p>
      `
    })

    this.ticket += `</div>`
    return this
  }

  buildCustomerInfo() {
    if (!this.customerInfo) return this

    this.ticket += `
      <div>
        <hr>
        <table id="client_table" style="width: 100%; border-collapse: collapse;">
          <tr>
            <td colspan="2" style="text-align: center; font-weight: bold; padding: 2px 0;">CLIENTE</td>
          </tr>
          <tr>
            <td style="padding: 1px 0;">Nombre:</td>
            <td style="text-align: right; padding: 1px 0;">${this.customerInfo.name}</td>
          </tr>
          <tr>
            <td style="padding: 1px 0;">Límite de crédito:</td>
            <td style="text-align: right; padding: 1px 0;">$ ${this.customerInfo.creditLimit}</td>
          </tr>
          <tr>
            <td style="padding: 1px 0;">Saldo anterior:</td>
            <td style="text-align: right; padding: 1px 0;">$ ${this.customerInfo.previousBalance}</td>
          </tr>
          <tr>
            <td style="padding: 1px 0;">Usado en esta compra:</td>
            <td style="text-align: right; padding: 1px 0;">$ ${this.customerInfo.currentPurchase}</td>
          </tr>
          <tr>
            <td style="padding: 1px 0;">Saldo final:</td>
            <td style="text-align: right; padding: 1px 0;">$ ${this.customerInfo.finalBalance}</td>
          </tr>
        </table>
        <p style="margin: 2px 0; font-size: 12px; text-align: center;">FECHA LÍMITE PAGO: ${this.customerInfo.paymentDueDate.toLocaleString('es-MX', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }) || 'N/A'}</p>
        <p style="margin: 2px 0; font-size: 12px; text-align: center; font-weight: bold;">Monto a pagar: $ ${this.customerInfo.amountToPay}</p>
      </div>
    `
    return this
  }

  buildInvoiceInfo() {
    if (
      !this.invoiceInfo.invoiceInstructions &&
      !this.invoiceInfo.invoiceUrl &&
      !this.invoiceInfo.qrCode
    )
      return this

    this.ticket += `
      <div class="invoice-info">
        <hr>
        <p style="margin: 2px 0; text-align: center;"><strong>Facturación</strong></p>
        <p style="margin: 2px 0; text-align: center;">${this.invoiceInfo.invoiceInstructions}</p>
    `

    if (this.invoiceInfo.invoiceUrl) {
      this.ticket += `
        <p style="margin: 2px 0; text-align: center;">${this.invoiceInfo.invoiceUrl}</p>
      `
    }

    if (this.invoiceInfo.qrCode) {
      this.ticket += `
        <div class="qr">
          <img src="${this.invoiceInfo.qrCode}" alt="QR Code" style="width: 100px; height: 100px;">
        </div>
      `
    }

    this.ticket += `</div>`
    return this
  }

  buildFooter() {
    this.ticket += `
      <div class="footer">
        <hr>
        <p style="margin: 5px 0; text-align: center;">${this.footerInfo.thankYouMessage}</p>
        <p style="margin: 2px 0; text-align: center;">${this.footerInfo.businessUrl}</p>
      </div>
    `
    return this
  }

  amountToWords(amount) {
    return toWords.convert(Number(amount))
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
    return `${this.ticketInfo.ticketId}`
  }

  async generateTicket() {
    await this.createQRCode()
    await this.setLogoPath()

    this.buildHeader()
      .buildTicketInfo()
      .buildItems()
      .buildTotal()
      .buildPaymentInfo()
      .buildCustomerInfo()
      .buildInvoiceInfo()
      .buildFooter()

    return await this.build()
  }
}
