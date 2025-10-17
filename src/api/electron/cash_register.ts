import { Response, CashRegister, CashRegisterState } from '@/api/interfaces'
import { CreateCashRegisterAudit } from '../interfaces/cashRegisterAudits'

export const getCashRegisterActive = async (): Promise<Response<any>> => window.electron.getCashRegisterActive()
export const getCurrentCashRegisterState = async (): Promise<Response<CashRegisterState>> => window.electron.getCurrentCashRegisterState()
export const openCashRegister = async (data: Partial<CashRegister> ,callback: any) => window.electron.createCashRegister(data, callback)
export const closeCashRegister = async (data: CreateCashRegisterAudit, callback: any) => window.electron.createCashRegisterAudit(data, callback)
