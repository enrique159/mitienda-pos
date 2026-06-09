type ExportColumn<T> = {
  key: keyof T | string
  label: string
  format?: (value: any, row: T) => string
}

const valueFromPath = (row: any, key: string) => key.split('.').reduce((value, path) => value?.[path], row)

const cleanCsvValue = (value: unknown) => {
  const text = value === null || value === undefined ? '' : `${value}`
  return `"${text.replace(/"/g, '""')}"`
}

export const useReportExport = () => {
  const exportCsv = <T extends Record<string, any>>(title: string, rows: T[], columns: ExportColumn<T>[]) => {
    const headers = columns.map((column) => cleanCsvValue(column.label)).join(',')
    const body = rows.map((row) => columns.map((column) => {
      const value = valueFromPath(row, String(column.key))
      return cleanCsvValue(column.format ? column.format(value, row) : value)
    }).join(',')).join('\n')
    const blob = new Blob([`${headers}\n${body}`], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `${title.toLowerCase().replace(/\s+/g, '-')}.csv`
    link.click()
    URL.revokeObjectURL(link.href)
  }

  const exportPdf = <T extends Record<string, any>>(title: string, rows: T[], columns: ExportColumn<T>[]) => {
    const tableRows = rows.map((row) => `
      <tr>${columns.map((column) => {
        const value = valueFromPath(row, String(column.key))
        return `<td>${column.format ? column.format(value, row) : value ?? ''}</td>`
      }).join('')}</tr>
    `).join('')
    const popup = window.open('', '_blank', 'width=1024,height=768')
    if (!popup) return
    popup.document.write(`
      <html>
        <head>
          <title>${title}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 24px; color: #1d1d1d; }
            h1 { font-size: 20px; margin-bottom: 16px; }
            table { border-collapse: collapse; width: 100%; font-size: 12px; }
            th, td { border-bottom: 1px solid #e5e5e5; padding: 8px; text-align: left; }
            th { background: #f8f6f4; }
          </style>
        </head>
        <body>
          <h1>${title}</h1>
          <table>
            <thead><tr>${columns.map((column) => `<th>${column.label}</th>`).join('')}</tr></thead>
            <tbody>${tableRows}</tbody>
          </table>
        </body>
      </html>
    `)
    popup.document.close()
    popup.focus()
    popup.print()
  }

  return { exportCsv, exportPdf }
}
