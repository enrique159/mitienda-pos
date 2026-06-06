import fs from 'fs/promises'
import { getDatetime } from './datetime'
import type { LoggerPayload } from '../shared/types'

type LogType = 'info' | 'error' | 'warning'
type LogMessage = string | LoggerPayload | unknown

const FILES_LOGS_BY_TYPE: Record<LogType, string> = {
  info: 'info.log',
  error: 'error.log',
  warning: 'warning.log',
}

async function writeLog(message: LogMessage, type: LogType): Promise<void> {
  const path = getLogPath(type)
  const normalizedMessage = typeof message === 'object'
    ? JSON.stringify(message)
    : String(message)
  const logMessage = `${getDatetime()} | ${normalizedMessage}\n`

  try {
    await fs.appendFile(path, logMessage, { encoding: 'utf8', mode: 0o666 })
  } catch (error) {
    console.error(error)
  }
}

function getLogPath(type: LogType): string {
  const dir = 'logs'
  const file = FILES_LOGS_BY_TYPE[type] || FILES_LOGS_BY_TYPE.error
  fs.mkdir(dir, { recursive: true }).catch(console.error)
  return `${dir}/${file}`
}

const logger = {
  log: (message: LogMessage, type: LogType) => writeLog(message, type),
  error: (message: LogMessage) => writeLog(message, 'error'),
  info: (message: LogMessage) => writeLog(message, 'info'),
  warning: (message: LogMessage) => writeLog(message, 'warning'),
}

export = logger

