const electron = require('electron')
const { PosPrinter } = require('electron-pos-printer')
const { logger, response } = require('../../helpers/index.cjs')

exports.getPrinters = () => {
  const { BrowserWindow } = electron
  let printWindow = BrowserWindow.getFocusedWindow()
  return printWindow.webContents
    .getPrintersAsync()
    .then((printers) => {
      const enhancedPrinters = printers.map((printer) => ({
        ...printer,
        statusText: getStatusText(printer),
      }))

      return response(true, 'Impresoras obtenidas', enhancedPrinters)
    })
    .catch((err) => {
      logger.error({ type: 'GET PRINTERS ERROR', message: `${err}`, data: err })
      return response(false, 'Error al obtener las impresoras', err)
    })
}

function getStatusText(printer) {
  const reasons = printer.options?.['printer-state-reasons'] || ''
  const accepting = printer.options?.['printer-is-accepting-jobs']
  const isAccepting = accepting === 'true' || accepting === '1'
  const status = printer.status

  if (process.platform === 'darwin') {
    const isOffline =
      reasons.includes('offline') ||
      reasons.includes('paused') ||
      reasons.includes('offline-report')

    if (isOffline || !isAccepting) return 'Desconectada'

    switch (status) {
    case 3:
      return 'Lista'
    case 4:
      return 'Imprimiendo'
    case 5:
      return 'Detenida o con error'
    default:
      return `Código desconocido (${status})`
    }
  }

  if (process.platform === 'win32') {
    if (status === 0) return 'Lista'
    if (status & 0x00000002) return 'Pausada'
    if (status & 0x00000008) return 'Con error'
    if (status & 0x00000020) return 'Sin papel'
    if (status & 0x00000040) return 'Fuera de línea'
    if (status & 0x00400000) return 'Imprimiendo'
    return `Código desconocido (${status})`
  }

  return 'Desconocido'
}

/*
 *************** IMPRIMIR TICKET ***************
 */
exports.printTicket = (printerName) => {
  const options = {
    preview: false, // Preview in window or print
    margin: '0 0 0 0', // margin of content body
    copies: 1, // Number of copies to print
    printerName: printerName, // printerName: string, check it at webContent.getPrinters()
    timeOutPerLine: 400,
    silent: true,
    pageSize: '80mm',
  }

  const data = [
    {
      type: 'text', // 'text' | 'barCode' | 'qrCode' | 'image' | 'table
      value: 'HEADER',
      style: { fontSize: '18px', textAlign: 'center' },
    },
    {
      type: 'text', // 'text' | 'barCode' | 'qrCode' | 'image' | 'table'
      value: 'Secondary text',
      style: {
        textDecoration: 'underline',
        fontSize: '10px',
        textAlign: 'center',
        color: 'black',
      },
    },
    {
      type: 'table',
      // style the table
      style: { border: '1px solid #ddd' },
      // list of the columns to be rendered in the table header
      tableHeader: ['Animal', 'Age'],
      // multi dimensional array depicting the rows and columns of the table body
      tableBody: [
        ['Cat', 2],
        ['Dog', 4],
        ['Horse', 12],
        ['Pig', 4],
      ],
      // list of columns to be rendered in the table footer
      tableFooter: ['Animal', 'Age'],
      // custom style for the table header
      tableHeaderStyle: { backgroundColor: '#fff', color: 'black' },
      // custom style for the table body
      tableBodyStyle: { border: '0.5px solid #ddd' },
      // custom style for the table footer
      tableFooterStyle: { backgroundColor: '#fff', color: 'black' },
    },
    {
      type: 'barCode',
      value: '023456789010',
      height: 40, // height of barcode, applicable only to bar and QR codes
      width: 2, // width of barcode, applicable only to bar and QR codes
      displayValue: true, // Display value below barcode
      fontsize: 12,
    },
    {
      type: 'text', // 'text' | 'barCode' | 'qrCode' | 'image' | 'table
      value: '************************',
      style: { fontSize: '10px', textAlign: 'center', marginBottom: '10px' },
    },
  ]

  return PosPrinter.print(data, options)
    .then(() => {
      return response(true, 'Ticket impreso', null)
    })
    .catch((error) => {
      logger.error({
        type: 'PRINT TICKET ERROR',
        message: `${error}`,
        data: error,
      })
      return response(false, 'Error al imprimir el ticket', error)
    })
}
