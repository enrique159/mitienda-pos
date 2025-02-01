export const formatPhone = (phone: string | undefined) => {
  if (!phone) {
    return ''
  }
  const formattedPhone = phone.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3')
  return formattedPhone
}