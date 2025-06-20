export interface AiModel {
  id: string
  id_company: string
  name: AiModelType
  model: string
  api_key: string
  status: AiModelStatus
  default: boolean
  created_at: string
  updated_at: string
  synced_at: string | null
}

export enum AiModelType {
  GEMINI = 'gemini',
  OPENAI = 'openai',
}

export type AiModelStatus = 'active' | 'inactive'

export interface CreateAiModel {
  id_company: string
  name: AiModelType
  model: string
  api_key: string
  status?: AiModelStatus
  default?: boolean
}

export interface UpdateAiModel {
  name?: AiModelType
  model?: string
  api_key?: string
  status?: AiModelStatus
  default?: boolean
}

export interface AIModelConfig {
  apiKey: string
  modelName?: string
}

export interface AIResponse {
  text: string
  raw?: any
}

export interface AIError {
  message: string
  code?: string
  raw?: any
}

export interface AIOptions {
  defaultModel?: string
}

export interface AIInstance {
  generateContent: (prompt: string) => Promise<string>
  isApiKeySet: () => boolean
  setApiKey: (apiKey: string) => void
}