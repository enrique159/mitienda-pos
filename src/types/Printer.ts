export interface Printer {
  name: string;
  displayName: string;
  description: string;
  status: number | string;
  isDefault: boolean;
  statusText: string;
  options: {
    copies: string;
    "device-uri": string;
    finishings: string;
    "job-cancel-after": string;
    "job-hold-until": string;
    "job-priority": string;
    "job-sheets": string;
    "marker-change-time": string;
    "number-up": string;
    "printer-commands": string;
    "printer-info": string;
    "printer-is-accepting-jobs": string;
    "printer-is-shared": string;
    "printer-is-temporary": string;
    "printer-location": string;
    "printer-make-and-model": string;
    "printer-state": string;
    "printer-state-change-time": string;
    "printer-state-reasons": string;
    "printer-type": string;
    "printer-uri-supported": string;
    "system_driverinfo": string;
  };
}