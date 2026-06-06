import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezonePlugin from 'dayjs/plugin/timezone'

dayjs.extend(utc)
dayjs.extend(timezonePlugin)

export function getDatetime(): string {
  return dayjs().format('YYYY-MM-DD HH:mm:ss')
}

export function getToday(): string {
  return dayjs().format('YYYYMMDD')
}

export function getUTCToday(): string {
  return dayjs().utc().format('YYYY-MM-DD 00:00:00')
}

export function getDatetimeForFile(): string {
  return dayjs().format('YYYY-MM-DD_HH-mm-ss')
}

export function getPaymentDueDate(): string {
  return dayjs().add(10, 'days').format('DD')
}

export function ticketDateFormatter(date: Date | string): string {
  return date instanceof Date
    ? dayjs(date).format('DD/MM/YYYY hh:mm A')
    : date
}

export function ticketDateFormatterTimezone(dateString?: string | null, timezone?: string | null): string {
  if (!dateString || !timezone) return ''
  const parsed = dayjs.utc(dateString, 'YYYY-MM-DD HH:mm:ss').tz(timezone)
  return parsed.format('DD/MM/YYYY hh:mm A')
}

