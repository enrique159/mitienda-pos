export type UUID = string

export interface AppResponse<T> {
  success: boolean
  message: string
  response: T
}

export type IpcCallback<T> = (response: T) => void

export interface LoggerPayload {
  type: string
  message: string
  data?: unknown
  error?: unknown
}

export interface Logger {
  info(payload: LoggerPayload): void
  error(payload: LoggerPayload): void
  warn?(payload: LoggerPayload): void
}

