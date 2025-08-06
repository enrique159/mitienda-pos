export interface Branch {
  id: string // ID único de la sucursal
  idCompany: string // ID único de la compañía a la que pertenece
  branchName: string // Nombre completo de la sucursal
  description?: string | null // Descripción de la sucursal
  isMain: boolean // Indica si es la sucursal principal
  image?: string | null // URL de la imagen de la sucursal
  timezone: string // Zona horaria de la sucursal
  address?: string | null // Dirección de la sucursal
  phone?: string | null // Teléfono de la sucursal
  status?: BranchStatus // Estado de la sucursal
  createdAt: string // Fecha de creación (formato ISO 8601)
  updatedAt: string // Fecha de última actualización (formato ISO 8601)
  syncedAt?: string // Fecha de sincronización o `null` si no se ha sincronizado
}

export enum BranchStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  DELETED = 'deleted',
}

export interface ICreateBranchPayload {
  branchName: string
  description?: string | null
  isMain: boolean
  timezone: string
  address?: string | null
  phone?: string | null
}

export interface TicketConfig {
  invoice_info?: {
    invoice_instructions: string
    invoice_url: string
    qr_code: string
  }
  footer_info?: {
    thank_you_message: string
    business_url: string
  }
}
