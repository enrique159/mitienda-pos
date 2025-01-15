import { UnitMeasurement } from "@/api/interfaces";

export const getAbbreviationUnitMeasurement = (unit: UnitMeasurement): string => {
  switch (unit) {
    case UnitMeasurement.PIECE:
      return 'u';
    case UnitMeasurement.KG:
      return 'kg';
    case UnitMeasurement.G:
      return 'g';
    case UnitMeasurement.LITER:
      return 'L';
    case UnitMeasurement.ML:
      return 'ml';
    case UnitMeasurement.BOX:
      return 'caja';
    case UnitMeasurement.OTHER:
      return 'otro';
  }
}

export const getNameUnitMeasurement = (unit: UnitMeasurement): string => {
  switch (unit) {
    case UnitMeasurement.PIECE:
      return 'Pieza';
    case UnitMeasurement.KG:
      return 'Kilogramo';
    case UnitMeasurement.G:
      return 'Gramo';
    case UnitMeasurement.LITER:
      return 'Litro';
    case UnitMeasurement.ML:
      return 'Mililitro';
    case UnitMeasurement.BOX:
      return 'Caja';
    case UnitMeasurement.OTHER:
      return 'Otro';
  }
}