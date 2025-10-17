import { Configuration } from '@/api/interfaces'

export const initialConfiguration = async (payload: any, callback: any) => window.electron.initialConfiguration(payload, callback)
export const getConfiguration = async (callback: any) => window.electron.getConfiguration(callback)
export const updateConfiguration = async (configuration: Configuration, callback: any) => window.electron.updateConfiguration(configuration, callback)
export const createConfiguration = async (configuration: Configuration, callback: any) => window.electron.createConfiguration(configuration, callback)
export const exportDatabase = async (callback: any) => window.electron.exportDatabase(callback)
export const importDatabase = async (data: any, callback: any) => window.electron.importDatabase(data, callback)
export const setDefaultPrinter = async (printerName: string | null, callback: any) => window.electron.setDefaultPrinter(printerName, callback)
