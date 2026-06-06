import logger from '../../../helpers/logger.js'
import { getFontFaceCSS, fontName } from '../extra/loadFonts.js'
import { getImageDataUrl } from '../extra/loadImage.js'
import { ticketDateFormatter, ticketDateFormatterTimezone, getToday } from '../../../helpers/datetime.js'
import { formatCurrency } from '../../../helpers/currency.js'
import { getSellerById } from '../../../modules/sellers/sellersRepository.js'

type AnyRecord = Record<string, any>

export default class CloseCashRegisterTicketBuilder {
  ticket = ''
  logoPath = ''
  branchInfo: AnyRecord = {}
  cashRegisterInfo: AnyRecord = {}

  constructor(payload) {
    this.logoPath = payload.branch.logo
    this.branchInfo = payload.branch
    this.cashRegisterInfo = payload.cashRegister
  }

  async setLogoPath() {
    this.logoPath = await getImageDataUrl(this.logoPath || 'default.jpg')
    if (!this.logoPath) this.logoPath = await getImageDataUrl('default.jpg')
  }

  buildHeader() {
    const today = new Date()

    const logoHtml = this.logoPath
      ? `<div class="logo-section">
          <img src="${this.logoPath}" alt="Logo">
        </div>`
      : `<div class="logo-section">LOGO</div>`

    this.ticket += `
      <div class="header">
        ${logoHtml}
        <div class="header-info">
          <h1>Corte de Caja</h1>
          <div class="subtitle">${this.branchInfo.alias} - ${this.branchInfo.name}</div>
          <div class="header-meta">
            Generado: ${ticketDateFormatter(today)}
          </div>
        </div>
      </div>
    `
    return this
  }

  buildControlSection() {
    const info = this.cashRegisterInfo
    const statusBadge = info.closure === 'full' ? 'Completo' : 'Parcial'

    this.ticket += `
      <div class="section">
        <div class="section-title">Control de Apertura y Cierre</div>
        <div class="two-columns">
          <div class="column">
            <div class="column-header">Apertura</div>
            <div class="column-data">
              <span class="label">Fecha y Hora</span>
              <span class="value">${ticketDateFormatter(
                info.opening_date
              )}</span>
            </div>
            <div class="column-data">
              <span class="label">Usuario</span>
              <span class="value">${info.opening_user_name || 'N/A'}</span>
            </div>
           
          </div>
          <div class="column">
            <div class="column-header">Cierre</div>
            <div class="column-data">
              <span class="label">Fecha y Hora</span>
              <span class="value">${ticketDateFormatter(info.created_at)}</span>
            </div>
            <div class="column-data">
              <span class="label">Usuario</span>
              <span class="value">${info.closing_user_name || 'N/A'}</span>
            </div>
           
          </div>
        </div>
      </div>
    `
    return this
  }

  buildPaymentMethodsSection() {
    const info = this.cashRegisterInfo

    this.ticket += `
      <div class="divider-section"></div>
      
      <div class="section">
        <div class="section-title">Métodos de Pago</div>
        <div class="data-row">
          <span class="label">Efectivo</span>
          <span class="value">${formatCurrency(info.cash_amount)}</span>
        </div>
        <div class="data-row">
          <span class="label">Tarjeta</span>
          <span class="value">${formatCurrency(info.card_amount)}</span>
        </div>
        <div class="data-row">
          <span class="label">Transferencia</span>
          <span class="value">${formatCurrency(info.transfer_amount)}</span>
        </div>
        <div class="data-row">
          <span class="label">Otros</span>
          <span class="value">${formatCurrency(info.other_amount)}</span>
        </div>
      </div>
      
      <div class="section">
        <div class="section-title">Desglose de Tarjeta</div>
        <div class="data-row">
          <span class="label">Operaciones con Tarjeta</span>
          <span class="value">${formatCurrency(info.card_breakdown || 0)}</span>
        </div>
      </div>
    `
    return this
  }

  buildCashBreakdownSection() {
    const info = this.cashRegisterInfo
    
    // Parsear el JSON de cash_breakdown
    let cashBreakdown: AnyRecord[] = []
    try {
      cashBreakdown = typeof info.cash_breakdown === 'string' 
        ? JSON.parse(info.cash_breakdown) 
        : (info.cash_breakdown || [])
    } catch (error) {
      console.error('Error parsing cash_breakdown:', error)
      cashBreakdown = []
    }

    // Si no hay desglose, no mostrar la sección
    if (!cashBreakdown || cashBreakdown.length === 0) {
      return this
    }

    // Separar billetes y monedas
    const bills = cashBreakdown.filter(item => item.type === 'bill')
    const coins = cashBreakdown.filter(item => item.type === 'coin')

    // Calcular totales
    const totalBills = bills.reduce((sum, item) => sum + (parseFloat(item.denomination) * parseInt(item.quantity)), 0)
    const totalCoins = coins.reduce((sum, item) => sum + (parseFloat(item.denomination) * parseInt(item.quantity)), 0)
    const grandTotal = totalBills + totalCoins

    this.ticket += `
      <div class="divider-section"></div>
      
      <div class="section">
        <div class="section-title">Desglose de Efectivo</div>
        <div class="cash-breakdown-container">
    `

    // Mostrar billetes
    if (bills.length > 0) {
      this.ticket += `
          <div class="breakdown-column">
            <div class="breakdown-subtitle">Billetes</div>
            <table class="breakdown-table">
              <thead>
                <tr>
                  <th class="left">Denominación</th>
                  <th class="center">Cantidad</th>
                  <th class="right">Subtotal</th>
                </tr>
              </thead>
              <tbody>
      `
      
      bills.forEach(item => {
        const subtotal = parseFloat(item.denomination) * parseInt(item.quantity)
        this.ticket += `
                <tr>
                  <td class="left">${formatCurrency(item.denomination)}</td>
                  <td class="center">× ${item.quantity}</td>
                  <td class="right">${formatCurrency(subtotal)}</td>
                </tr>
        `
      })

      this.ticket += `
              </tbody>
              <tfoot>
                <tr class="total-row">
                  <td colspan="2" class="left"><strong>Total Billetes</strong></td>
                  <td class="right"><strong>${formatCurrency(totalBills)}</strong></td>
                </tr>
              </tfoot>
            </table>
          </div>
      `
    }

    // Mostrar monedas
    if (coins.length > 0) {
      this.ticket += `
          <div class="breakdown-column">
            <div class="breakdown-subtitle">Monedas</div>
            <table class="breakdown-table">
              <thead>
                <tr>
                  <th class="left">Denominación</th>
                  <th class="center">Cantidad</th>
                  <th class="right">Subtotal</th>
                </tr>
              </thead>
              <tbody>
      `
      
      coins.forEach(item => {
        const subtotal = parseFloat(item.denomination) * parseInt(item.quantity)
        this.ticket += `
                <tr>
                  <td class="left">${formatCurrency(item.denomination)}</td>
                  <td class="center">× ${item.quantity}</td>
                  <td class="right">${formatCurrency(subtotal)}</td>
                </tr>
        `
      })

      this.ticket += `
              </tbody>
              <tfoot>
                <tr class="total-row">
                  <td colspan="2" class="left"><strong>Total Monedas</strong></td>
                  <td class="right"><strong>${formatCurrency(totalCoins)}</strong></td>
                </tr>
              </tfoot>
            </table>
          </div>
      `
    }

    this.ticket += `
        </div>
        <div class="breakdown-grand-total">
          <span class="label">Total en Efectivo</span>
          <span class="value">${formatCurrency(grandTotal)}</span>
        </div>
      </div>
    `

    return this
  }

  buildOperationsSection() {
    const info = this.cashRegisterInfo

    this.ticket += `
      <div class="divider-section"></div>
      
      <div class="section">
        <div class="section-title">Operaciones</div>
        <div class="data-row">
          <span class="label">Número de Ventas</span>
          <span class="value">${info.count_sales || 0}</span>
        </div>
        <div class="data-row">
          <span class="label">Movimientos Registrados</span>
          <span class="value">${info.count_movements || 0}</span>
        </div>
        <div class="data-row">
          <span class="label">Ingresos Adicionales</span>
          <span class="value">${formatCurrency(info.income)}</span>
        </div>
        <div class="data-row">
          <span class="label">Retiros</span>
          <span class="value">${formatCurrency(info.withdraw)}</span>
        </div>
      </div>
    `
    return this
  }

  buildSummarySection() {
    const info = this.cashRegisterInfo
    const differenceClass = info.difference < 0 ? 'difference' : ''

    this.ticket += `
      <div class="section">
        <div class="section-title">Resumen Financiero</div>
        <div class="summary-section">
          <div class="summary-row">
            <span class="label">Monto de Apertura</span>
            <span class="value">${formatCurrency(info.opening_amount)}</span>
          </div>
          <div class="summary-row">
            <span class="label">Efectivo</span>
            <span class="value">${formatCurrency(info.cash_amount)}</span>
          </div>
          <div class="summary-row">
            <span class="label">Tarjeta</span>
            <span class="value">${formatCurrency(info.card_amount)}</span>
          </div>
          <div class="summary-row">
            <span class="label">Transferencia</span>
            <span class="value">${formatCurrency(info.transfer_amount)}</span>
          </div>
          <div class="summary-row">
            <span class="label">Otros</span>
            <span class="value">${formatCurrency(info.other_amount)}</span>
          </div>
          <div class="summary-row">
            <span class="label">Ingresos</span>
            <span class="value">${formatCurrency(info.income)}</span>
          </div>
          <div class="summary-row">
            <span class="label">Retiros</span>
            <span class="value">${formatCurrency(info.withdraw)}</span>
          </div>
          <div class="summary-row">
            <span class="label">Balance Esperado</span>
            <span class="value">${formatCurrency(info.balance)}</span>
          </div>
          <div class="summary-row total">
            <span class="label">Total</span>
            <span class="value">${formatCurrency(info.total_amount)}</span>
          </div>
          <div class="summary-row ${differenceClass}">
            <span class="label">Diferencia</span>
            <span class="value">${formatCurrency(info.difference)}</span>
          </div>
        </div>
      </div>
    `
    return this
  }

  buildSignatures() {
    const info = this.cashRegisterInfo

    this.ticket += `
      <div class="signatures">
        <div class="signature-box">
          <div class="signature-line"></div>
          <div class="signature-label">Firma de quien realiza el corte</div>
          <div class="signature-name">${info.closing_user_name || 'N/A'}</div>
        </div>
      </div>
      
      <div class="footer-note">
        Generado por MiTienda POS | ${ticketDateFormatter(getToday())}
        <br>
        ${info.id}
      </div>
    `
    return this
  }

  async build() {
    const fontFaceCSS = await getFontFaceCSS()

    const style = `
      <style>
        @page {
          margin: 1.5cm;
          size: 21.59cm 27.94cm;
        }
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: ${fontName}, 'Courier New', Courier, monospace;
          background: white;
          padding: 0;
          color: #000;
          font-size: 11px;
          orphans: 3;
          widows: 3;
        }
        
        .container {
          width: 21.59cm;
          min-height: auto;
          background: white;
          margin: 0 auto;
          padding: 0;
          page-break-after: auto;
        }
        
        .header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 20px;
          padding-bottom: 15px;
          page-break-inside: avoid;
          page-break-after: auto;
        }
        
        .logo-section {
          width: 120px;
          height: 120px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 9px;
          color: #666;
          padding: 5px;
          flex-shrink: 0;
        }
        
        .logo-section img {
          max-width: 110px;
          max-height: 110px;
          object-fit: contain;
        }
        
        .header-info {
          flex: 1;
          text-align: right;
        }
        
        .header-info h1 {
          font-size: 16px;
          font-weight: bold;
          margin-bottom: 5px;
          color: #000;
          text-transform: uppercase;
        }
        
        .header-info .subtitle {
          font-size: 12px;
          color: #000;
          margin-bottom: 10px;
        }
        
        .header-meta {
          font-size: 10px;
          color: #000;
          line-height: 1.6;
          margin-top: 10px;
        }
        
        .section {
          margin-bottom: 20px;
          padding: 10px;
          page-break-inside: avoid;
          page-break-after: auto;
        }
        
        .section-title {
          font-size: 11px;
          font-weight: bold;
          margin-bottom: 10px;
          color: #000;
          text-align: left;
          border-bottom: 1px solid #000;
          padding-bottom: 5px;
        }
        
        .data-row {
          display: flex;
          justify-content: space-between;
          padding: 5px 0;
          border-bottom: 1px dotted #ccc;
        }
        
        .data-row:last-child {
          border-bottom: none;
        }
        
        .data-row .label {
          font-size: 10px;
          color: #000;
        }
        
        .data-row .value {
          font-size: 10px;
          color: #000;
          font-weight: bold;
          text-align: right;
          font-variant-numeric: tabular-nums;
        }
        
        .two-columns {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
          padding: 10px;
          page-break-inside: avoid;
        }
        
        .column {
          display: flex;
          flex-direction: column;
          padding: 8px;
        }
        
        .column-header {
          font-size: 11px;
          font-weight: bold;
          color: #000;
          margin-bottom: 8px;
          padding-bottom: 5px;
          border-bottom: 1px solid #000;
          text-align: center;
        }
        
        .column-data {
          display: flex;
          justify-content: space-between;
          padding: 4px 0;
          border-bottom: 1px dotted #ccc;
        }
        
        .column-data:last-child {
          border-bottom: none;
        }
        
        .column-data .label {
          font-size: 10px;
          color: #000;
        }
        
        .column-data .value {
          font-size: 10px;
          color: #000;
          font-weight: bold;
          text-align: right;
          font-variant-numeric: tabular-nums;
        }
        
        .status-badge {
          display: inline-block;
          padding: 2px 8px;
          color: #000;
          font-size: 9px;
          font-weight: bold;
          text-transform: uppercase;
        }
        
        .summary-section {
          margin-top: 15px;
          padding: 10px;
          page-break-inside: avoid;
        }
        
        .summary-row {
          display: flex;
          justify-content: space-between;
          padding: 6px 0;
          font-size: 10px;
          border-bottom: 1px dotted #ccc;
        }
        
        .summary-row:last-child {
          border-bottom: none;
        }
        
        .summary-row .label {
          color: #000;
        }
        
        .summary-row .value {
          font-weight: bold;
          font-variant-numeric: tabular-nums;
          color: #000;
        }
        
        .summary-row.total {
          font-size: 14px;
          font-weight: bold;
          color: #000;
          padding: 10px 0;
          margin-top: 8px;
          border-top: 2px solid #000;
          border-bottom: 2px solid #000;
          text-align: center;
        }
        
        .summary-row.total .label,
        .summary-row.total .value {
          font-size: 14px;
        }
        
        .summary-row.difference {
          color: #000;
          font-weight: bold;
          font-size: 11px;
          padding: 8px 0;
          border: 1px solid #000;
          padding-left: 8px;
          padding-right: 8px;
          margin-top: 5px;
        }
        
        .signatures {
          display: flex;
          justify-content: center;
          margin-top: 60px;
          padding-top: 20px;
          page-break-inside: avoid;
        }
        
        .signature-box {
          text-align: center;
          max-width: 400px;
          width: 100%;
        }
        
        .signature-line {
          border-top: 1px solid #000;
          margin-bottom: 8px;
          margin-top: 40px;
        }
        
        .signature-label {
          font-size: 10px;
          color: #000;
          text-transform: uppercase;
          margin-bottom: 5px;
          font-weight: bold;
        }
        
        .signature-name {
          font-size: 10px;
          color: #000;
        }
        
        .footer-note {
          text-align: center;
          font-size: 9px;
          color: #666;
          margin-top: 30px;
          padding-top: 10px;
        }
        
        .cash-breakdown-container {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
          margin-top: 10px;
          page-break-inside: avoid;
        }
        
        .breakdown-column {
          display: flex;
          flex-direction: column;
        }
        
        .breakdown-subtitle {
          font-size: 10px;
          font-weight: bold;
          color: #000;
          margin-bottom: 8px;
          padding-bottom: 3px;
          border-bottom: 1px solid #ccc;
          text-align: center;
        }
        
        .breakdown-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 9px;
        }
        
        .breakdown-table thead th {
          padding: 5px 3px;
          border-bottom: 1px solid #000;
          font-weight: bold;
          color: #000;
          font-size: 9px;
        }
        
        .breakdown-table tbody td {
          padding: 4px 3px;
          border-bottom: 1px dotted #ccc;
          font-size: 9px;
        }
        
        .breakdown-table tfoot td {
          padding: 6px 3px;
          border-top: 1px solid #000;
          font-size: 9px;
        }
        
        .breakdown-table .left {
          text-align: left;
        }
        
        .breakdown-table .center {
          text-align: center;
        }
        
        .breakdown-table .right {
          text-align: right;
          font-variant-numeric: tabular-nums;
        }
        
        .breakdown-table .total-row {
          background-color: #f5f5f5;
        }
        
        .breakdown-grand-total {
          display: flex;
          justify-content: space-between;
          margin-top: 15px;
          padding: 10px;
          background-color: #f5f5f5;
          border: 1px solid #000;
          font-size: 12px;
          font-weight: bold;
          page-break-inside: avoid;
        }
        
        .breakdown-grand-total .label {
          color: #000;
        }
        
        .breakdown-grand-total .value {
          color: #000;
          font-variant-numeric: tabular-nums;
        }
        
        .divider-section {
          height: 1px;
          background: #000;
          margin: 15px 0;
        }
      </style>
    `

    return `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <title>Reporte de Cierre de Caja</title>
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
    this.buildControlSection()
    this.buildPaymentMethodsSection()
    this.buildCashBreakdownSection()
    this.buildOperationsSection()
    this.buildSummarySection()
    this.buildSignatures()
    return await this.build()
  }
}
