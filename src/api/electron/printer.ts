export const getPrinters = async (callback: any) => window.electron.getPrinters(callback)
export const printTestTicket = async (printerName: string, callback: any) => window.electron.printTestTicket(printerName, callback)
export const printSaleTicket = async (printerName: string | null, payload: any, callback: any) => window.electron.printSaleTicket(printerName, payload, callback)
export const printCloseCashRegisterTicket = async (printerName: string | null, payload: any, callback: any) => window.electron.printCloseCashRegisterTicket(printerName, payload, callback)
