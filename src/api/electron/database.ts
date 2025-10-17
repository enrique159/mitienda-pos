import { Response } from '@/api/interfaces'

export const clearDatabase = async (payload: { excludedTables: string[] }, callback: any): Promise<Response<null>> => window.electron.clearDatabase(payload, callback)
