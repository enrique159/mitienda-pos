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

export interface BusinessInfo {
  businessName: string;
  legalName: string;
  address: string;
  location: string;
  rfc: string;
  branchInfo?: string;
}

export interface TicketInfo {
  ticketId: string;
  cashier: string;
  attendedBy: string;
  date: string | Date;
}

export interface PaymentMethod {
  name: string;
  amount: number;
}

export interface PaymentInfo {
  total: number;
  tax: number;
  paymentMethods: PaymentMethod[];
  amountGiven?: number;
  change?: number;
}

export interface CustomerInfo {
  name: string;
  creditLimit: string;
  previousBalance: string;
  currentPurchase: string;
  finalBalance: string;
  paymentDueDate: string;
  amountToPay: string;
}

export interface InvoiceInfo {
  invoiceInstructions: string;
  invoiceUrl: string;
  qrCode: string;
}

export interface FooterInfo {
  thankYouMessage: string;
  businessUrl: string;
}

export interface SaleTicketItem {
  quantity: number;
  name: string;
  price: number;
  subtotal: number;
  discount?: number;
  discountLabel?: string;
}

export interface SaleTicketBuilderOptions {
  businessInfo?: Partial<BusinessInfo>;
  ticketInfo?: Partial<TicketInfo>;
  items?: SaleTicketItem[];
  paymentInfo?: Partial<PaymentInfo>;
  customerInfo?: CustomerInfo | null;
  invoiceInstructions?: string;
  invoiceUrl?: string;
  qrCode?: string;
  thankYouMessage?: string;
  businessUrl?: string;
  logoPath?: string;
}