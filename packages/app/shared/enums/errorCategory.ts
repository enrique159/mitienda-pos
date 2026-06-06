export const ErrorCategory = {
  UNKNOWN: 0,
  SYSTEM: 1,
  APPLICATION: 2,
  BUSINESS: 3,
  USER: 4,
} as const

export type ErrorCategory = typeof ErrorCategory[keyof typeof ErrorCategory]

