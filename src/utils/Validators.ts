export const strongPassword = (value: string) => {
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
  return passwordRegex.test(value)
}

export const phoneNumber = (value: string) => {
  const phoneRegex = /^\d{10}$/
  return phoneRegex.test(value)
}

export const samePassword = (first: string, second: string) => {
  return first == second
}
