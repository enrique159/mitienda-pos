const { getFontFaceCSS } = require('../extra/loadFonts.cjs')
const { getImageDataUrl } = require('../extra/loadImage.cjs')

module.exports = class TestTicketBuilder {
  constructor() { }

  logoPath = ''

  async setLogoPath() {
    this.logoPath = await getImageDataUrl('default.jpg')
  }

  build() {
    const data = {
      items: [
        {
          name: 'Producto ejemplo',
          price: 100,
          subtotal: 100,
        },
      ],
      total: 100,
    }
    const productRows = data.items
      .map(
        (item) => `
      <tr>
        <td colspan="2">${item.name}</td>
        <td class="right">${item.price}</td>
        <td class="right">${item.subtotal}</td>
      </tr>
    `
      )
      .join('')

    const rawDocument = `<!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <title>Print preview</title>
      <style>
        ${getFontFaceCSS()}
        @page {
          margin: 0;
          size: 80mm auto;
        }
        body {
          margin: 0;
          padding: 0;
          font-family: 'Barlow Semi Condensed', monospace;
          font-size: 14px;
          font-weight: bold;
          width: 80mm;
        }
        hr {
          border-top: 1px dashed black;
        }
        .container {
          width: 72mm;
          padding: 0 4mm;
        }

        .logo {
          display: flex;
          justify-content: center;
          margin-bottom: 1rem;
        }

        .logo img {
          width: 200px;
        }

        .info {
          text-align: center;
          font-size: 12px;
        }

        .info p {
          margin: 0 0 0.5rem;
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

        .text-xs {
          font-size: 10px;
        }

        .left {
          text-align: left;
        }

        .right {
          text-align: right;
        }

        .center {
          text-align: center;
        }

        .visits {
          width: 72mm;
          display: grid;
          grid-template-columns: 1fr 1fr;
        }

        .qr {
          display: flex;
          justify-content: center;
          padding: 1rem 0;
        }
      </style>
    </head>

    <body>
      <div class="container">
        <header>
          <div class="center">
            <img src="${this.logoPath}" alt="Logo" style="width: 100%; height: auto; max-width: 200px; max-height: 80px; object-fit: contain;">
            <h3 style="margin: 5px 0;">Mi Tienda POS</h3>
            <p style="margin: 2px 0;">Ticket de compra</p>
            <p style="margin: 2px 0;">${new Date().toLocaleString()}</p>
          </div>
          <hr>
        </header>
        <table id="table">
          <thead id="table-head">
            <tr>
              <th class="left" colspan="2">Producto</th>
              <th class="right">Precio</th>
              <th class="right">Subtotal</th>
            </tr>
          </thead>
          <tbody id="table-body">
            ${
  productRows ||
              `
            <tr>
              <td colspan="2">Producto ejemplo</td>
              <td class="right">100.00</td>
              <td class="right">100.00</td>
            </tr>`
}
          </tbody>
          <tfoot id="table-footer">
            <tr>
              <td colspan="3" class="right"><strong>Total:</strong></td>
              <td class="right"><strong>${data.total || '100.00'}</strong></td>
            </tr>
          </tfoot>
        </table>
        <hr>
        <div class="info">
          <p>Gracias por su compra</p>
          <p class="text-xs">www.mitienda.com</p>
        </div>
        <hr>
      </div>
    </body>
    </html>`

    return rawDocument
  }

  async generateTicket() {
    await this.setLogoPath()
    return this.build()
  }
}
