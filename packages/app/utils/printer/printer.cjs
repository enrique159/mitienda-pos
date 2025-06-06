const electron = require('electron')
const { logger, response } = require('../../helpers/index.cjs')
const fsPromises = require('fs/promises')
const path = require('path')
const os = require('os')
const fs = require('fs')

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

/*
  ************* OBTENER ESTADO DE LA IMPRESORA *************
  Se encarga de obtener el estado de la impresora por medio de los valores de la impresora
  Preparado para dar soporte a macOS y Windows
*/
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


/**
 * @param {string} printerName - Nombre de la impresora
 * @param {TicketBuilder} builderInstance - Instancia de TicketBuilder
 * @returns { Promise<Response<{ success: boolean, message: string, data: any }>> }
 */
exports.printTicket = async (printerName, builderInstance) => {
  const { BrowserWindow } = electron
  let printWindow = new BrowserWindow({
    show: false,
  })

  try {
    // Esperar a que se genere el ticket con las fuentes cargadas
    const rawDocument = await builderInstance.generateTicket()

    return new Promise((resolve, reject) => {
      printWindow.on("closed", function () { printWindow = null })
      printWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(rawDocument)}`)

      printWindow.webContents.on("did-finish-load", () => {
        printWindow.webContents.print(
          {
            copies: 1,
            silent: true,
            printBackground: true,
            deviceName: printerName,
            color: false,
            scaleFactor: 100,
            dpi: {
              horizontal: 203,
              vertical: 203,
            },
            margins: {
              marginType: "custom",
              top: 0,
              bottom: 0,
              right: 0,
              left: 0,
            },
            pageSize: { width: 72000, height: 297000 },
          },
          (success, error) => {
            if (!success) {
              logger.error({ type: 'PRINT TICKET ERROR', message: `${error}`, data: error })
              reject(response(false, 'Error al imprimir el ticket', error))
              if (printWindow) {
                printWindow.destroy()
              }
              return
            }
            resolve(response(true, 'Ticket impreso', null))
            if (printWindow) {
              printWindow.destroy()
            }
          }
        )
      })

      // Manejar errores de carga
      printWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
        const error = new Error(`Error al cargar el documento: ${errorDescription} (${errorCode})`)
        logger.error({ type: 'PRINT TICKET ERROR', message: error.message, data: error })
        reject(response(false, 'Error al cargar el documento para imprimir', error))
        if (printWindow) {
          printWindow.destroy()
        }
      })
    })
  } catch (error) {
    logger.error({ type: 'PRINT TICKET ERROR', message: `${error}`, data: error })
    if (printWindow) {
      printWindow.destroy()
    }
    throw error // Relanzar el error para que sea manejado por el llamador
  }
}


/**
 * @param {TicketBuilder} builderInstance - Instancia de TicketBuilder
 * @returns { Promise<Response<{ success: boolean, message: string, data: string }>> }
 */
exports.printTicketToPDF = async (builderInstance) => {
  const { BrowserWindow } = electron
  let printWindow = new BrowserWindow({
    show: false,
    webPreferences: {
      defaultEncoding: 'UTF-8',
    },
  })

  try {
    // Esperar a que se genere el ticket con las fuentes cargadas
    const rawDocument = await builderInstance.generateTicket()

    return new Promise((resolve, reject) => {
      printWindow.on("closed", () => { printWindow = null })
      printWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(rawDocument)}`)

      // Manejar errores de carga
      printWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
        const error = new Error(`Error al cargar el documento: ${errorDescription} (${errorCode})`)
        logger.error({ type: 'PRINT TICKET PDF ERROR', message: error.message, data: error })
        reject(response(false, 'Error al cargar el documento para generar PDF', error))
        if (printWindow) {
          printWindow.destroy()
        }
      })

      printWindow.webContents.on("did-finish-load", async () => {
        const dirPath = path.join(os.homedir(), 'Desktop', 'mitienda-pos-tickets')
        const pdfPath = path.join(dirPath, `ticket-${Date.now()}.pdf`)

        try {
          // Crear el directorio si no existe
          if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true })
          }

          // Generar el PDF
          const data = await printWindow.webContents.printToPDF({
            pageSize: {
              width: 3.15,  // 80mm en pulgadas (80 / 25.4)
              height: 11.69, // Altura de papel A4 en pulgadas
            },
            margins: {
              marginType: 'none',
            },
            printBackground: true,
            scale: 0.98,
          })

          // Guardar el archivo PDF
          await fsPromises.writeFile(pdfPath, data)

          // Devolver la ruta del archivo generado
          resolve(response(true, 'Ticket guardado como PDF', pdfPath))
        } catch (error) {
          logger.error({ type: 'PRINT TICKET PDF ERROR', message: `${error}`, data: error })
          reject(response(false, 'Error al generar el PDF del ticket', error))
        } finally {
          if (printWindow) {
            printWindow.destroy()
          }
        }
      })
    })
  } catch (error) {
    logger.error({ type: 'PRINT TICKET PDF ERROR', message: `${error}`, data: error })
    if (printWindow) {
      printWindow.destroy()
    }
    throw error // Relanzar el error para que sea manejado por el llamador
  }
}

/* exports.printTicket = async (printerName, data = { items: [], total: 0 }) => {
  return await new Promise((resolve, reject) => {
    const { BrowserWindow } = electron
    let printWindow = new BrowserWindow({
      show: false,
    })

    // Generar filas de productos dinámicamente
    const productRows = data.items.map((item) => `
      <tr>
        <td colspan="2">${item.name}</td>
        <td class="right">${item.price}</td>
        <td class="right">${item.subtotal}</td>
      </tr>
    `).join('')

    const rawDocument = `<!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <title>Print preview</title>
      <style>
        @page {
          margin: 0;
          size: 80mm auto;
        }
        body {
          margin: 0;
          padding: 0;
          font-family: 'Arial', monospace;
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
            ${productRows || `
            <tr>
              <td colspan="2">Producto ejemplo</td>
              <td class="right">100.00</td>
              <td class="right">100.00</td>
            </tr>`}
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

    printWindow.on("closed", function () { printWindow = null })
    printWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(rawDocument)}`)

    printWindow.webContents.on("did-finish-load", () => {
      printWindow.webContents.print(
        {
          copies: 1,
          silent: true,
          printBackground: true,
          deviceName: printerName,
          color: false,
          scaleFactor: 100,
          dpi: {
            horizontal: 203,
            vertical: 203,
          },
          margins: {
            marginType: "custom",
            top: 0,
            bottom: 0,
            right: 0,
            left: 0,

          },
          pageSize: { width: 72000, height: 297000 },
        },
        (success, error) => {
          if (!success) {
            logger.error({ type: 'PRINT TICKET ERROR', message: `${error}`, data: error })
            reject(response(false, 'Error al imprimir el ticket', error))
          }
          resolve(response(true, 'Ticket impreso', null))
          printWindow.destroy()
        }
      )
    })
  })
} */