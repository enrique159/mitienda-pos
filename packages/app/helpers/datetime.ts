// @ts-nocheck
const dayjs = require('dayjs')
const utc = require('dayjs/plugin/utc')
const timezone = require('dayjs/plugin/timezone')

dayjs.extend(utc)
dayjs.extend(timezone)

exports.getDatetime = function () {
  return dayjs().format('YYYY-MM-DD HH:mm:ss')
}

exports.getToday = function () {
  return dayjs().format('YYYYMMDD')
}

exports.getUTCToday = function () {
  return dayjs().utc().format('YYYY-MM-DD 00:00:00')
}

exports.getDatetimeForFile = function () {
  return dayjs().format('YYYY-MM-DD_HH-mm-ss')
}

exports.getPaymentDueDate = function () {
  return dayjs().add(10, 'days').format('DD')
}

exports.ticketDateFormatter = function (date) {
  return date instanceof Date
    ? dayjs(date).format('DD/MM/YYYY hh:mm A')
    : date
}

exports.ticketDateFormatterTimezone = function (dateString, timezone) {
  if (!dateString || !timezone) return ''
  const parsed = dayjs.utc(dateString, 'YYYY-MM-DD HH:mm:ss').tz(timezone)
  return parsed.format('DD/MM/YYYY hh:mm A')
}

export {}
