import { CreateCashMovement } from '@/api/interfaces'

export const createCashMovement = async (data: CreateCashMovement, callback: any) => window.electron.createCashMovement(data, callback)
