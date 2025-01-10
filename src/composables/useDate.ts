import dayjs from "dayjs";
import "dayjs/locale/es";

dayjs.locale("es");

export const useDate = () => {
  const getCurrentDate = () => {
    // Regresa la fecha y hora en locale español por defecto en formato tipo (Martes, 1 de junio de 2021 12:00:00)
    return dayjs().locale("es").format("dddd, D [de] MMMM HH:mm a");
  }

  return {
    getCurrentDate
  }
}
