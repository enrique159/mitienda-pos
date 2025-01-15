export interface Configuration {
  id?: number,
  configured: boolean,
  mode: Modes,
  enabled: boolean,
  last_sync: Date,
}

export enum Modes {
  OFFLINE = 'offline',
  BUSINESS = 'business',
}