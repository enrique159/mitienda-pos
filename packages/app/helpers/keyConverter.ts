// @ts-nocheck
/**
 * Convierte un string de camelCase a snake_case
 * @param {string} str - String en formato camelCase
 * @returns {string} String en formato snake_case
 */
exports.stringCamelToSnakeCase = (str) => {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)
}

/**
 * Convierte todas las claves de un objeto de camelCase a snake_case
 * @param {Object} obj - Objeto con claves en camelCase
 * @returns {Object} Objeto con claves en snake_case
 */
exports.camelToSnakeCase = (obj) => {
  if (obj === null || typeof obj !== 'object' || Array.isArray(obj)) {
    return obj
  }

  const result = {}

  Object.keys(obj).forEach((key) => {
    const snakeKey = exports.stringCamelToSnakeCase(key)

    // Si el valor es un objeto, procesar recursivamente
    if (obj[key] !== null && typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
      result[snakeKey] = exports.camelToSnakeCase(obj[key])
    } else if (Array.isArray(obj[key])) {
      // Si es un array, procesar cada elemento que sea un objeto
      result[snakeKey] = obj[key].map((item) =>
        item !== null && typeof item === 'object' ? exports.camelToSnakeCase(item) : item
      )
    } else {
      result[snakeKey] = obj[key]
    }
  })

  return result
}
export {}
