import { Response, Tax } from '@/api/interfaces'

export const getTaxes = async (): Promise<Response<Tax[]>> => window.electron.getTaxes()
export const createTax = async (data: any, callback: any) => window.electron.createTax(data, callback)
export const deleteTax = async (id: string, callback: any) => window.electron.deleteTax(id, callback)
