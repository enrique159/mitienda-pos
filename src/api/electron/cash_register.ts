import { Response, CashRegister, CashRegisterState } from '@/api/interfaces'
import { CashRegisterAuditDetail, CreateCashRegisterAudit } from '../interfaces/cashRegisterAudits'

export interface CashRegisterAuditFilters {
  startDate?: string
  endDate?: string
}

export const getCashRegisterActive = async (): Promise<Response<any>> => window.electron.getCashRegisterActive()
export const getCurrentCashRegisterState = async (): Promise<Response<CashRegisterState>> => window.electron.getCurrentCashRegisterState()
export const openCashRegister = async (data: Partial<CashRegister> ,callback: any) => window.electron.createCashRegister(data, callback)
export const closeCashRegister = async (data: CreateCashRegisterAudit, callback: any) => window.electron.createCashRegisterAudit(data, callback)
export const getCashRegisterAudits = async (
  filters: CashRegisterAuditFilters = {}
): Promise<Response<CashRegisterAuditDetail[]>> => window.electron.getCashRegisterAudits(filters)
