import { getFontFaceCSS, fontName } from '../extra/loadFonts.js'
import { getImageDataUrl } from '../extra/loadImage.js'
import { getToday, ticketDateFormatter } from '../../../helpers/datetime.js'

type ReportColumn = {
  label: string
}

type ReportPayload = {
  title: string
  generatedAt?: string | Date
  branch?: {
    logo?: string
    name?: string
    alias?: string
  }
  filters?: Array<{
    label: string
    value: string
  }>
  columns: ReportColumn[]
  rows: string[][]
}

const escapeHtml = (value: unknown) => `${value ?? ''}`
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;')

const slug = (value: string) => value
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/[^a-zA-Z0-9]+/g, '-')
  .replace(/^-|-$/g, '')
  .toUpperCase()

export default class ReportsDocumentBuilder {
  document = ''
  logoPath = ''
  payload: ReportPayload

  constructor(payload: ReportPayload) {
    this.payload = payload
    this.logoPath = payload.branch?.logo || ''
  }

  async setLogoPath() {
    this.logoPath = await getImageDataUrl(this.logoPath || 'default.jpg')
    if (!this.logoPath) this.logoPath = await getImageDataUrl('default.jpg')
  }

  buildHeader() {
    const branchAlias = this.payload.branch?.alias || 'MITI'
    const branchName = this.payload.branch?.name || 'Sucursal'
    const generatedAt = this.payload.generatedAt ? new Date(this.payload.generatedAt) : new Date()
    const logoHtml = this.logoPath
      ? `<div class="logo-section"><img src="${this.logoPath}" alt="Logo"></div>`
      : '<div class="logo-section">LOGO</div>'

    this.document += `
      <div class="header">
        ${logoHtml}
        <div class="header-info">
          <h1>${escapeHtml(this.payload.title)}</h1>
          <div class="subtitle">${escapeHtml(branchAlias)} - ${escapeHtml(branchName)}</div>
          <div class="header-meta">Generado: ${escapeHtml(ticketDateFormatter(generatedAt))}</div>
        </div>
      </div>
    `
    return this
  }

  buildFilters() {
    const filters = (this.payload.filters || []).filter((filter) => filter.value)
    if (!filters.length) return this

    this.document += `
      <div class="section">
        <div class="section-title">Filtros</div>
        <div class="filters-grid">
          ${filters.map((filter) => `
            <div class="filter-item">
              <span class="label">${escapeHtml(filter.label)}</span>
              <span class="value">${escapeHtml(filter.value)}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `
    return this
  }

  buildTable() {
    const columns = this.payload.columns || []
    const rows = this.payload.rows || []

    this.document += `
      <div class="section">
        <div class="section-title">Detalle</div>
        ${rows.length ? `
          <table>
            <thead>
              <tr>
                ${columns.map((column) => `<th>${escapeHtml(column.label)}</th>`).join('')}
              </tr>
            </thead>
            <tbody>
              ${rows.map((row) => `
                <tr>
                  ${columns.map((_, index) => `<td>${escapeHtml(row[index])}</td>`).join('')}
                </tr>
              `).join('')}
            </tbody>
          </table>
        ` : '<div class="empty-state">Sin datos para mostrar</div>'}
      </div>
    `
    return this
  }

  buildFooter() {
    this.document += `
      <div class="footer-note">
        Generado por MiTienda POS | ${ticketDateFormatter(new Date())}
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
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        body {
          font-family: ${fontName}, Arial, sans-serif;
          color: #000;
          background: #fff;
          font-size: 10px;
        }

        .container {
          width: 21.59cm;
          margin: 0 auto;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 20px;
          padding-bottom: 15px;
          page-break-inside: avoid;
        }

        .logo-section {
          width: 100px;
          height: 100px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #666;
          font-size: 9px;
          flex-shrink: 0;
        }

        .logo-section img {
          max-width: 95px;
          max-height: 95px;
          object-fit: contain;
        }

        .header-info {
          flex: 1;
          text-align: right;
        }

        .header-info h1 {
          font-size: 16px;
          font-weight: 700;
          text-transform: uppercase;
          margin-bottom: 5px;
        }

        .subtitle {
          font-size: 12px;
          margin-bottom: 8px;
        }

        .header-meta,
        .footer-note {
          font-size: 9px;
          color: #555;
        }

        .section {
          margin-bottom: 18px;
          page-break-inside: avoid;
        }

        .section-title {
          font-size: 11px;
          font-weight: 700;
          border-bottom: 1px solid #000;
          padding-bottom: 5px;
          margin-bottom: 10px;
        }

        .filters-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px 14px;
        }

        .filter-item {
          border-bottom: 1px dotted #ccc;
          padding-bottom: 4px;
        }

        .filter-item .label {
          display: block;
          color: #555;
          font-size: 8px;
          text-transform: uppercase;
        }

        .filter-item .value {
          display: block;
          font-size: 10px;
          font-weight: 600;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          font-size: 8.5px;
          page-break-inside: auto;
        }

        thead {
          display: table-header-group;
        }

        tr {
          page-break-inside: avoid;
        }

        th {
          text-align: left;
          padding: 6px 4px;
          border-bottom: 1px solid #000;
          font-weight: 700;
          text-transform: uppercase;
        }

        td {
          padding: 5px 4px;
          border-bottom: 1px dotted #ccc;
          vertical-align: top;
        }

        .empty-state {
          padding: 32px;
          text-align: center;
          color: #555;
          border: 1px dotted #ccc;
        }

        .footer-note {
          text-align: center;
          margin-top: 30px;
          padding-top: 10px;
        }
      </style>
    `

    return `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <title>${escapeHtml(this.payload.title)}</title>
        <style>${fontFaceCSS}</style>
        ${style}
      </head>
      <body>
        <div class="container">
          ${this.document}
        </div>
      </body>
      </html>
    `
  }

  getTicketName() {
    const timestamp = Math.floor((Date.now() / 1000) % 1000000)
    return `REPORT-${slug(this.payload.title || 'REPORTE')}-${getToday()}-${timestamp}`
  }

  async generateTicket() {
    await this.setLogoPath()
    this.buildHeader()
    this.buildFilters()
    this.buildTable()
    this.buildFooter()
    return await this.build()
  }
}
