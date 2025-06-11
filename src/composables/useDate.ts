import dayjs from 'dayjs'
import 'dayjs/locale/es'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import { useBranch } from './useBranch'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.locale('es')
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(relativeTime)

export const useDate = () => {
  const { timezone: tz } = useBranch()

  const getCurrentDate = () => {
    // Regresa la fecha y hora en locale español por defecto en formato tipo (Martes, 1 de junio de 2021 12:00:00)
    return dayjs
      .utc()
      .tz(tz.value)
      .locale('es')
      .format('dddd, D [de] MMMM hh:mm a')
  }

  const formatDatetime = (date: string | Date | undefined) => {
    if (!date) return ''
    return dayjs
      .utc(date)
      .tz(tz.value)
      .locale('es')
      .format('dddd, D [de] MMMM [de] YYYY hh:mm:ss a')
  }

  const formatDatetimeShort = (date: Date | string | undefined) => {
    if (!date) return ''
    return dayjs.utc(date).tz(tz.value).locale('es').format('DD/MM/YYYY HH:mm')
  }

  const formatDate = (date: Date | string | undefined) => {
    if (!date) return ''
    return dayjs(date).format('YYYY-MM-DD')
  }

  const formatDateShort = (date: Date | string | undefined) => {
    if (!date) return ''
    return dayjs(date).format('DD/MM/YYYY')
  }

  const formatTime12 = (time: string | undefined) => {
    if (!time) return ''
    return dayjs(`2000-01-01 ${time}`).format('hh:mm a')
  }

  const formatTime24 = (time: string | undefined) => {
    if (!time) return ''
    return dayjs(`2000-01-01 ${time}`).format('HH:mm')
  }

  const getNextPaymentDueDateCustomer = (dayMonth: string | null, format: string = 'DD/MM/YYYY') => {
    if (!dayMonth) return null
    const today = dayjs()
    const day = parseInt(dayMonth, 10)

    // Create a date for the current month with the given day
    let nextPaymentDueDate = dayjs().date(1) // Start from first day of month

    // Set to the requested day or last day of month if day doesn't exist
    nextPaymentDueDate = nextPaymentDueDate.date(
      Math.min(day, nextPaymentDueDate.daysInMonth())
    )

    // If the day has already passed this month, set it for next month
    if (today.date() > day || today.isAfter(nextPaymentDueDate, 'day')) {
      nextPaymentDueDate = nextPaymentDueDate.add(1, 'month')
      // Recalculate for next month in case it has fewer days
      nextPaymentDueDate = nextPaymentDueDate.date(
        Math.min(day, nextPaymentDueDate.daysInMonth())
      )
    }

    return nextPaymentDueDate.format(format)
  }

  const getRelativeTime = (date: string | Date | null) => {
    if (!date) return ''
    return dayjs(date).fromNow()
  }

  return {
    getCurrentDate,
    formatDatetime,
    formatDatetimeShort,
    formatDateShort,
    formatDate,
    formatTime12,
    formatTime24,
    getNextPaymentDueDateCustomer,
    getRelativeTime,
  }
}
