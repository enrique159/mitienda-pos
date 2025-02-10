import dayjs from "dayjs"
import "dayjs/locale/es"
import utc from "dayjs/plugin/utc"
import timezone from "dayjs/plugin/timezone"
import { useBranch } from "./useBranch"

dayjs.locale("es")
dayjs.extend(utc)
dayjs.extend(timezone)

export const useDate = () => {
  const { timezone: tz } = useBranch()

  const getCurrentDate = () => {
    // Regresa la fecha y hora en locale español por defecto en formato tipo (Martes, 1 de junio de 2021 12:00:00)
    return dayjs.utc().tz(tz.value).locale("es").format("dddd, D [de] MMMM hh:mm a")
  }

  const formatDatetime = (date: string | undefined) => {
    if (!date) return ""
    return dayjs.utc(date).tz(tz.value).locale("es").format("dddd, D [de] MMMM [de] YYYY hh:mm:ss a")
  }

  const formatDatetimeShort = (date: Date | string | undefined) => {
    if (!date) return ""
    return dayjs.utc(date).tz(tz.value).locale("es").format("DD/MM/YYYY HH:mm")
  }

  const formatDate = (date: Date | string | undefined) => {
    if (!date) return ""
    return dayjs(date).format("YYYY-MM-DD")
  }

  return {
    getCurrentDate,
    formatDatetime,
    formatDatetimeShort,
    formatDate,
  }
}
