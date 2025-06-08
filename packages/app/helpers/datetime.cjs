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