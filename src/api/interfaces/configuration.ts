export interface Configuration {
  id?: number,
  configured: boolean,
  mode: Modes,
  default_printer: string | null,
  enable_sync: boolean,
  last_sync: Date,
}

export enum Modes {
  OFFLINE = 'offline',
  BUSINESS = 'business',
}