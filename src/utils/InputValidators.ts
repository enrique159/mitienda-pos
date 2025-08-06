// ALLOWED KEYS FOR ALL VALIDATORS
const ALLOWED_KEYS = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Delete', 'Tab']

/**
 * Base validator function to reduce code duplication
 * @param event Keyboard event
 * @param regex Regular expression to validate the key
 * @param additionalCheck Optional function for additional validation logic
 */
const baseValidator = (
  event: KeyboardEvent,
  regex: RegExp,
  additionalCheck?: (key: string, event: KeyboardEvent) => boolean
) => {
  const key = event.key

  if (ALLOWED_KEYS.includes(key)) {
    return
  }

  // Run additional check if provided
  if (additionalCheck && !additionalCheck(key, event)) {
    event.preventDefault()
    return
  }

  // Apply regex validation
  if (!regex.test(key)) {
    event.preventDefault()
  }
}

// VALIDATE ONLY NUMBERS
export const validateOnlyNumbers = (event: KeyboardEvent) => {
  baseValidator(event, /^[0-9]$/)
}

// VALIDATE NUMBERS AND DOT
export const validateNumbersAndDot = (event: KeyboardEvent, value = '') => {
  baseValidator(
    event,
    /^[0-9.]$/,
    (key) => !(value.includes('.') && key === '.')
  )
}

// VALIDATE ONLY LETTERS
export const validateOnlyLetters = (event: KeyboardEvent) => {
  baseValidator(event, /^[a-zA-Z]$/)
}

// VALIDATE ONLY LETTERS AND SPACES
export const validateOnlyLettersAndSpaces = (event: KeyboardEvent) => {
  baseValidator(event, /^[a-zA-Z ]$/)
}

// VALIDATE ONLY NUMBERS AND LETTERS
export const validateOnlyNumbersAndLetters = (event: KeyboardEvent) => {
  baseValidator(event, /^[a-zA-Z0-9]$/)
}

// VALIDATE ONLY EMAIL
export const validateOnlyEmail = (event: KeyboardEvent) => {
  // Note: For email validation, we're still using a simple regex for key press validation
  // A full email validation would be done on form submission with a more complex regex
  baseValidator(event, /^[a-zA-Z0-9._%+-@]$/)
}

