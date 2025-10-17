import { Response, AiModel, CreateAiModel, UpdateAiModel } from '@/api/interfaces'

export const getAiModels = async (callback: any): Promise<Response<AiModel[]>> => window.electron.getAiModels(callback)
export const getAiModelById = async (id: string, callback: any): Promise<Response<AiModel>> => window.electron.getAiModelById(id, callback)
export const createAiModel = async (aiModel: CreateAiModel, callback: any): Promise<Response<AiModel>> => window.electron.createAiModel(aiModel, callback)
export const updateAiModel = async (data: { id: string, aiModel: UpdateAiModel }, callback: any): Promise<Response<AiModel>> => window.electron.updateAiModel(data, callback)
export const deleteAiModel = async (id: string, callback: any): Promise<Response<AiModel>> => window.electron.deleteAiModel(id, callback)
export const updateAiModelStatus = async (data: { id: string, status: 'active' | 'inactive' }, callback: any): Promise<Response<AiModel>> => window.electron.updateAiModelStatus(data, callback)
export const setDefaultAiModel = async (data: { id: string, companyId: string }, callback: any): Promise<Response<AiModel>> => window.electron.setDefaultAiModel(data, callback)
