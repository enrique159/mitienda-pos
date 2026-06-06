export const stringCamelToSnakeCase = (str: string): string => {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)
}

export const camelToSnakeCase = (obj: unknown): unknown => {
  if (obj === null || typeof obj !== 'object' || Array.isArray(obj)) {
    return obj
  }

  const result: Record<string, unknown> = {}

  Object.keys(obj).forEach((key) => {
    const source = obj as Record<string, unknown>
    const snakeKey = stringCamelToSnakeCase(key)
    const value = source[key]

    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      result[snakeKey] = camelToSnakeCase(value)
    } else if (Array.isArray(value)) {
      result[snakeKey] = value.map((item) =>
        item !== null && typeof item === 'object' ? camelToSnakeCase(item) : item
      )
    } else {
      result[snakeKey] = value
    }
  })

  return result
}

