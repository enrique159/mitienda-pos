import { CreateCashMovement } from '@/api/interfaces'

export const createCashMovement = async (data: CreateCashMovement, callback: any) => window.electron.createCashMovement(data, callback)
export const getMovementsInTurn = async (cashRegisterId: string, callback: any) => window.electron.getMovementsInTurn(cashRegisterId, callback)